'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Plus, Trash2, Tag, ToggleLeft, ToggleRight } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_booking_amount: number;
  max_discount: number | null;
  max_uses: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
}

const EMPTY: Omit<Coupon, 'id' | 'used_count'> = {
  code: '', discount_type: 'percentage', discount_value: 10,
  min_booking_amount: 0, max_discount: null, max_uses: null,
  valid_from: null, valid_until: null, is_active: true,
};

export default function AdminCouponsPage() {
  const { user, isAdmin, token } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (!isAdmin) { router.push('/'); return; }
    fetchCoupons();
  }, [user, isAdmin, token]);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setCoupons((await res.json()).coupons || []);
    } catch { toast.error('Failed to load coupons'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!form.code) { toast.error('Enter a coupon code'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) { toast.success('Coupon created!'); setShowModal(false); setForm(EMPTY); fetchCoupons(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    } catch { toast.error('Network error'); }
    finally { setSaving(false); }
  };

  const toggleCoupon = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: !current }),
      });
      if (res.ok) { setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c)); }
    } catch { toast.error('Failed'); }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { setCoupons(prev => prev.filter(c => c.id !== id)); toast.success('Deleted'); }
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-500 hover:text-green-600"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Tag className="w-6 h-6 text-green-600" /> Coupons</h1>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700">
            <Plus className="w-4 h-4" /> New Coupon
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading…</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No coupons yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map(c => (
              <div key={c.id} className={`bg-white rounded-2xl shadow-sm border p-5 ${c.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900 text-lg font-mono">{c.code}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span>
                        {c.discount_type === 'percentage' ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                      </span>
                      {c.min_booking_amount > 0 && <span>Min: ₹{c.min_booking_amount}</span>}
                      {c.max_discount && <span>Max discount: ₹{c.max_discount}</span>}
                      {c.max_uses && <span>Used: {c.used_count}/{c.max_uses}</span>}
                      {c.valid_until && <span>Expires: {new Date(c.valid_until).toLocaleDateString('en-IN')}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleCoupon(c.id, c.is_active)} className="text-gray-500 hover:text-green-600">
                      {c.is_active ? <ToggleRight className="w-6 h-6 text-green-600" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                    <button onClick={() => deleteCoupon(c.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Create Coupon</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Coupon Code *</label>
                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SAVE50" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Discount Type</label>
                  <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value as 'percentage' | 'fixed' }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Value *</label>
                  <input type="number" value={form.discount_value}
                    onChange={e => setForm(f => ({ ...f, discount_value: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Min Amount (₹)</label>
                  <input type="number" value={form.min_booking_amount || ''}
                    onChange={e => setForm(f => ({ ...f, min_booking_amount: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Max Discount (₹)</label>
                  <input type="number" value={form.max_discount || ''}
                    onChange={e => setForm(f => ({ ...f, max_discount: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Valid From</label>
                  <input type="date" value={form.valid_from || ''}
                    onChange={e => setForm(f => ({ ...f, valid_from: e.target.value || null }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Valid Until</label>
                  <input type="date" value={form.valid_until || ''}
                    onChange={e => setForm(f => ({ ...f, valid_until: e.target.value || null }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Max Uses</label>
                <input type="number" value={form.max_uses || ''}
                  onChange={e => setForm(f => ({ ...f, max_uses: e.target.value ? Number(e.target.value) : null }))}
                  placeholder="Leave blank for unlimited"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleCreate} disabled={saving}
                className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50">
                {saving ? 'Creating…' : 'Create Coupon'}
              </button>
              <button onClick={() => { setShowModal(false); setForm(EMPTY); }}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
