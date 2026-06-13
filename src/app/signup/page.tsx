'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.name || !form.email || !form.phone || !form.password) { toast.error('Please fill all fields'); return; }
      if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
      if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
      toast.success('Account created! Please login.');
      setTimeout(() => { window.location.href = '/login'; }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/"><Image src="/logo.png" alt="Lohagarh Turf" width={72} height={72} className="w-16 h-auto mx-auto mb-4" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Book turf slots in seconds</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            {[
              { label:'Full Name',         key:'name',    type:'text',     ph:'Rahul Sharma' },
              { label:'Email Address',     key:'email',   type:'email',    ph:'you@example.com' },
              { label:'Phone Number',      key:'phone',   type:'tel',      ph:'+91 XXXXXXXXXX' },
              { label:'Password',          key:'password',type:'password', ph:'Min. 6 characters' },
              { label:'Confirm Password',  key:'confirm', type:'password', ph:'Re-enter password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{f.label}</label>
                <input type={f.type} value={form[f.key as keyof typeof form]} onChange={set(f.key)}
                  placeholder={f.ph} className="form-input" />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 mt-2">
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 font-semibold hover:underline">Login</Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-gray-400 hover:text-green-600 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
