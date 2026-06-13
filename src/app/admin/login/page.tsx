'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      // TODO: replace with real API → POST /api/admin/login
      if (email === 'admin@lohagarh.com' && password === 'admin@123') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminEmail', email);
        toast.success('Welcome, Admin!');
        router.push('/admin');
      } else {
        toast.error('Invalid admin credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Lohagarh Turf" width={72} height={72} className="w-16 h-auto mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Lohagarh Turf — Staff Only</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Admin Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@lohagarh.com"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-600 focus:border-green-500 outline-none transition text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-600 focus:border-green-500 outline-none transition text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 mt-2">
              {loading ? 'Signing in…' : 'Login to Admin Panel'}
            </button>
          </form>
        </div>

        <a href="/" className="block text-center mt-6 text-xs text-gray-600 hover:text-gray-400 transition-colors">
          ← Back to Website
        </a>

        {/* Remove this block in production */}
        <div className="mt-4 bg-yellow-900/30 border border-yellow-700/40 rounded-xl p-4 text-xs text-yellow-400 text-center">
          <p className="font-semibold mb-1">Dev credentials</p>
          <p>admin@lohagarh.com / admin@123</p>
        </div>
      </div>
    </div>
  );
}
