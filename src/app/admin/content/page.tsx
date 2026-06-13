'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, FileText, Save } from 'lucide-react';

const CONTENT_KEYS = [
  { key: 'upi_id', label: 'UPI ID for Payments', type: 'text', placeholder: '9876543210@ybl' },
  { key: 'admin_whatsapp', label: 'Admin WhatsApp Number', type: 'text', placeholder: '+917777777777' },
  { key: 'terms', label: 'Terms & Conditions', type: 'text' },
  { key: 'contact_info', label: 'Contact Information (JSON)', type: 'json', placeholder: '{"phone":"7777777777","address":"Beside Keoladeo National Park, Bharatpur","hours":"5am - 12am"}' },
];

export default function AdminContentPage() {
  const { user, isAdmin, token } = useAuth();
  const router = useRouter();
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (!isAdmin) { router.push('/'); return; }
    fetchContents();
  }, [user, isAdmin, token]);

  const fetchContents = async () => {
    try {
      for (const item of CONTENT_KEYS) {
        const res = await fetch(`/api/admin/content?key=${item.key}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setContents(prev => ({ ...prev, [item.key]: data.content || '' }));
        }
      }
    } catch { /* */ } finally { setLoading(false); }
  };

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key, content: contents[key] }),
      });
      if (res.ok) toast.success('Saved!');
      else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    } catch { toast.error('Network error'); }
    finally { setSaving(null); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-gray-500 hover:text-green-600"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" /> Site Content
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading…</div>
        ) : (
          <div className="space-y-5">
            {CONTENT_KEYS.map(item => (
              <div key={item.key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-800">{item.label}</h2>
                  <button onClick={() => handleSave(item.key)}
                    disabled={saving === item.key}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {saving === item.key ? 'Saving…' : 'Save'}
                  </button>
                </div>
                <textarea
                  value={contents[item.key] || ''}
                  onChange={e => setContents(prev => ({ ...prev, [item.key]: e.target.value }))}
                  placeholder={item.placeholder || `Enter ${item.label}…`}
                  rows={item.key === 'terms' ? 15 : 4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none resize-y font-mono"
                />
                {item.key === 'upi_id' && (
                  <p className="text-xs text-gray-400 mt-2">
                    Your UPI ID from GPay / PhonePe / Paytm. Example: 9876543210@ybl or yourname@okaxis
                  </p>
                )}
                {item.key === 'contact_info' && (
                  <p className="text-xs text-gray-400 mt-2">
                    JSON format: {`{"phone":"7777777777","address":"Your address","hours":"5am - 12am"}`}
                  </p>
                )}
                {item.key === 'terms' && (
                  <p className="text-xs text-gray-400 mt-2">
                    Supports basic formatting: # Heading, ## Subheading, - list item
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
