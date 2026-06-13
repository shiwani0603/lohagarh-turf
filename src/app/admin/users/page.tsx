'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Search, Shield, ShieldOff, MessageSquare, Users } from 'lucide-react';

interface UserRow {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  is_admin: boolean;
  is_blocked: boolean;
  booking_count: number;
  total_spent: number;
  created_at: string;
}

export default function AdminUsersPage() {
  const { user, isAdmin, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (!isAdmin) { router.push('/'); return; }
    fetchUsers();
  }, [user, isAdmin, token]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setUsers((await res.json()).users || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const toggleAdmin = async (id: string, current: boolean) => {
    if (!confirm(`${current ? 'Remove' : 'Grant'} admin access?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_admin: !current }),
      });
      if (res.ok) { setUsers(prev => prev.map(u => u.id === id ? { ...u, is_admin: !current } : u)); toast.success('Updated!'); }
    } catch { toast.error('Failed'); }
  };

  const toggleBlock = async (id: string, current: boolean) => {
    if (!confirm(`${current ? 'Unblock' : 'Block'} this user?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_blocked: !current }),
      });
      if (res.ok) { setUsers(prev => prev.map(u => u.id === id ? { ...u, is_blocked: !current } : u)); toast.success('Updated!'); }
    } catch { toast.error('Failed'); }
  };

  const sendWhatsApp = (phone: string) => {
    const cleaned = phone.replace('+', '');
    window.open(`https://wa.me/${cleaned}`, '_blank');
  };

  const filtered = users.filter(u =>
    !search || u.phone.includes(search) || (u.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-gray-500 hover:text-green-600"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-600" /> Users ({users.length})
          </h1>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone…"
            className="w-full max-w-sm pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-green-500 outline-none bg-white" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-400">
              <div className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
              Loading…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['User', 'Phone', 'Bookings', 'Total Spent', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(u => (
                    <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${u.is_blocked ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{u.name || 'No name'}</p>
                        {u.email && <p className="text-xs text-gray-400">{u.email}</p>}
                        <div className="flex gap-1 mt-1">
                          {u.is_admin && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Admin</span>}
                          {u.is_blocked && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Blocked</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">{u.phone}</td>
                      <td className="px-4 py-3 text-gray-700">{u.booking_count || 0}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">₹{(u.total_spent || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.is_blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {u.is_blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(u.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => sendWhatsApp(u.phone)}
                            className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="WhatsApp">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => toggleAdmin(u.id, u.is_admin)}
                            className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" title="Toggle Admin">
                            {u.is_admin ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => toggleBlock(u.id, u.is_blocked)}
                            className={`p-1.5 rounded-lg ${u.is_blocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                            title={u.is_blocked ? 'Unblock' : 'Block'}>
                            <span className="text-xs font-bold">{u.is_blocked ? 'UN' : 'BLK'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
