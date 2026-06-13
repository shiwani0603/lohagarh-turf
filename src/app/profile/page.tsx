'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { formatTime } from '@/lib/pricing';
import { format, parseISO } from 'date-fns';
import { User, Calendar, Clock, CheckCircle, XCircle, Timer, Edit2, LogOut } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  sport: string;
  total_price: number;
  final_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_method: string;
  created_at: string;
}

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700',  icon: Timer },
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700',    icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700',        icon: XCircle },
};

export default function ProfilePage() {
  const { user, userProfile, token, logout, refreshProfile } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login?redirect=/profile'); return; }
    fetchBookings();
    setName(userProfile?.name || '');
    setEmail(userProfile?.email || '');
  }, [user, userProfile]);

  const fetchBookings = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch { /* */ } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        await refreshProfile();
        setEditing(false);
        toast.success('Profile updated!');
      }
    } catch { toast.error('Failed to update profile'); }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Cancel this booking?')) return;
    if (!token) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { toast.success('Booking cancelled'); fetchBookings(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed to cancel'); }
    } catch { toast.error('Failed to cancel booking'); }
  };

  const now = new Date().toISOString().split('T')[0];
  const filtered = bookings.filter(b => {
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    if (activeTab === 'past') return b.status !== 'cancelled' && b.date < now;
    return b.status !== 'cancelled' && b.date >= now;
  });

  const handleLogout = async () => { await logout(); router.push('/'); };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <User className="w-10 h-10 text-green-600" />
                </div>
                {editing ? (
                  <div className="w-full space-y-3 mt-2">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional)"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none" />
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} className="flex-1 bg-green-600 text-white text-sm py-2 rounded-xl font-semibold hover:bg-green-700">Save</button>
                      <button onClick={() => setEditing(false)} className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-xl hover:bg-gray-50">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-bold text-gray-900 text-lg">{userProfile?.name || 'Guest User'}</h2>
                    <p className="text-gray-500 text-sm">{userProfile?.phone}</p>
                    {userProfile?.email && <p className="text-gray-400 text-xs mt-1">{userProfile.email}</p>}
                  </>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-1 text-sm text-gray-600">
                <div className="flex justify-between py-1.5">
                  <span>Games played</span>
                  <span className="font-bold text-gray-900">{bookings.filter(b => b.status === 'confirmed' && b.date < now).length}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Total bookings</span>
                  <span className="font-bold text-gray-900">{bookings.length}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {!editing && (
                  <button onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center gap-2 text-green-600 text-sm font-semibold border border-green-200 py-2.5 rounded-xl hover:bg-green-50">
                    <Edit2 className="w-4 h-4" /> Update Personal Info
                  </button>
                )}
                <button onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-red-600 text-sm font-semibold border border-red-200 py-2.5 rounded-xl hover:bg-red-50">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
                {userProfile?.is_admin && (
                  <Link href="/admin" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700">
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex gap-2 mb-5">
                {(['upcoming', 'past', 'cancelled'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                      activeTab === tab ? 'bg-green-600 text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm">Loading bookings…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No {activeTab} bookings</p>
                  {activeTab === 'upcoming' && (
                    <Link href="/book" className="mt-4 inline-block bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-green-700">
                      Book a Slot
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(b => {
                    const cfg = STATUS_CONFIG[b.status];
                    const Icon = cfg.icon;
                    const isPending = b.status === 'pending';
                    const isUpcoming = b.date >= now && b.status !== 'cancelled';
                    return (
                      <div key={b.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {format(parseISO(b.date), 'd MMMM yyyy')}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {formatTime(b.start_time)} – {formatTime(b.end_time)}
                            </div>
                          </div>
                          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                            <Icon className="w-3 h-3" /> {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 font-bold">₹{b.final_amount}</span>
                          {isUpcoming && !isPending && b.status === 'confirmed' && (
                            <button onClick={() => handleCancel(b.id)}
                              className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50">
                              Cancel
                            </button>
                          )}
                          {isPending && (
                            <span className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg">
                              Awaiting payment verification
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
