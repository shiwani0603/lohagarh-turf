'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { formatTime } from '@/lib/pricing';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, CheckCircle, XCircle, Clock, Search, MessageSquare, Plus } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  sport: string;
  final_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_method: string;
  payment_ref: string;
  payment_screenshot_url: string | null;
  booked_by_admin: boolean;
  users: { name: string | null; phone: string };
}

export default function AdminBookingsPage() {
  const { user, isAdmin, token } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [adminDate, setAdminDate] = useState('');
  const [adminStart, setAdminStart] = useState('09:00');
  const [adminEnd, setAdminEnd] = useState('10:00');
  const [adminNote, setAdminNote] = useState('');
  const [addingSlot, setAddingSlot] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (!isAdmin) { router.push('/'); return; }
    fetch('/api/admin/bookings', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setBookings(d.bookings || []))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [user, isAdmin, token]);

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        toast.success(`Booking ${status}!`);
        if (status === 'confirmed') {
          const booking = bookings.find(b => b.id === id);
          if (booking) sendWhatsApp(booking);
        }
      } else {
        const d = await res.json(); toast.error(d.error || 'Failed');
      }
    } catch { toast.error('Network error'); }
  };

  const sendWhatsApp = (booking: Booking) => {
    const adminPhone = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+917777777777').replace('+', '');
    const phone = booking.users.phone.replace('+91', '').replace('+', '');
    const msg = encodeURIComponent(
      `✅ *Lohagarh Turf — Booking Confirmed!*\n\n` +
      `📅 Date: ${format(parseISO(booking.date), 'd MMMM yyyy')}\n` +
      `⏰ Time: ${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}\n` +
      `🏟️ Sport: ${booking.sport}\n` +
      `💰 Amount: ₹${booking.final_amount}\n\n` +
      `See you on the field! Please arrive 5 min early.\n_Lohagarh Turf, Bharatpur_`
    );
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
  };

  const handleAdminBookSlot = async () => {
    if (!adminDate || !adminStart || !adminEnd) { toast.error('Fill all fields'); return; }
    setAddingSlot(true);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date: adminDate, start_time: adminStart, end_time: adminEnd, note: adminNote }),
      });
      if (res.ok) {
        toast.success('Slot blocked by admin');
        setShowAddModal(false);
        window.location.reload();
      } else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    } catch { toast.error('Network error'); }
    finally { setAddingSlot(false); }
  };

  const filtered = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search && !b.users.phone.includes(search) && !(b.users.name || '').toLowerCase().includes(search.toLowerCase()) && !b.date.includes(search)) return false;
    return true;
  });

  const STATUS = {
    pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-500 hover:text-green-600"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          </div>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700">
            <Plus className="w-4 h-4" /> Block Slot
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex gap-1">
            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize ${filter === f ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name/phone/date…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-green-500 outline-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-400">
              <div className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">No bookings found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['User', 'Date', 'Time', 'Amount', 'Status', 'Payment', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{b.users.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500">{b.users.phone}</p>
                        {b.booked_by_admin && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Admin</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{format(parseISO(b.date), 'd MMM yyyy')}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {formatTime(b.start_time)}–{formatTime(b.end_time)}
                      </td>
                      <td className="px-4 py-3 font-bold text-green-600">₹{b.final_amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS[b.status].color}`}>
                          {STATUS[b.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {b.payment_ref && <p className="text-xs text-gray-600">{b.payment_ref}</p>}
                        {b.payment_screenshot_url && (
                          <a href={b.payment_screenshot_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline">View Screenshot</a>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {b.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(b.id, 'confirmed')}
                                className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Confirm">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => updateStatus(b.id, 'cancelled')}
                                className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Cancel">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {b.status === 'confirmed' && !b.booked_by_admin && (
                            <button onClick={() => sendWhatsApp(b)}
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Send WhatsApp">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          )}
                          {b.status === 'confirmed' && (
                            <button onClick={() => updateStatus(b.id, 'cancelled')}
                              className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Cancel">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Admin Block Slot Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Block a Slot (Admin)</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Date</label>
                  <input type="date" value={adminDate} onChange={e => setAdminDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Start Time</label>
                    <input type="time" value={adminStart} onChange={e => setAdminStart(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">End Time</label>
                    <input type="time" value={adminEnd} onChange={e => setAdminEnd(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Note (optional)</label>
                  <input value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="e.g. Tournament"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={handleAdminBookSlot} disabled={addingSlot}
                  className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50">
                  {addingSlot ? 'Blocking…' : 'Block Slot'}
                </button>
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
