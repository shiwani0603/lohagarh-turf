'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Phone, KeyRound, ArrowLeft } from 'lucide-react';

function LoginForm() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const { sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) { toast.error('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    try {
      const token = await sendOtp(cleaned);
      setOtpToken(token);
      setStep('otp');
      toast.success('OTP sent to your mobile number!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      toast.error(msg || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken) return;
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      await verifyOtp(otpToken, otp, phone);
      toast.success('Login successful! Welcome to Lohagarh Turf.');
      router.push(redirect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      toast.error(msg || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="Lohagarh Turf" width={72} height={72}
              className="w-16 h-auto mx-auto mb-4"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'phone' ? 'Login / Sign Up' : 'Verify OTP'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 'phone'
              ? 'Enter your mobile number to continue'
              : `OTP sent to +91 ${phone}`}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
                  <span className="px-4 py-3 bg-gray-50 text-gray-600 font-medium text-sm border-r border-gray-200">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    maxLength={10}
                    className="flex-1 px-4 py-3 text-gray-900 outline-none text-sm"
                    required
                  />
                  <Phone className="w-4 h-4 text-gray-400 mr-4" />
                </div>
                <p className="text-xs text-gray-400 mt-2">We&apos;ll send a 6-digit OTP to verify your number</p>
              </div>
              <button type="submit" disabled={loading || phone.length < 10}
                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP…
                  </span>
                ) : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Enter 6-Digit OTP
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="flex-1 px-4 py-3.5 text-center text-2xl tracking-[0.5em] text-gray-900 outline-none font-bold"
                    required
                    autoFocus
                  />
                  <KeyRound className="w-4 h-4 text-gray-400 mr-4" />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">Check your SMS messages for the OTP</p>
              </div>
              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying…
                  </span>
                ) : 'Verify & Login'}
              </button>
              <button type="button" onClick={() => { setStep('phone'); setOtp(''); setOtpToken(null); }}
                className="w-full text-center text-sm text-gray-500 hover:text-green-600 flex items-center justify-center gap-1 mt-2">
                <ArrowLeft className="w-4 h-4" /> Change Number
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing you agree to our{' '}
          <Link href="/terms" className="text-green-600 hover:underline">Terms & Conditions</Link>
        </p>
        <p className="text-center mt-4">
          <Link href="/" className="text-xs text-gray-400 hover:text-green-600 transition-colors flex items-center justify-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
