'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Phone, KeyRound, ArrowLeft } from 'lucide-react';

const ADMIN_WA = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+917793014321').replace('+', '');

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function LoginForm() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [smsFailed, setSmsFailed] = useState(false);
  const { sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const waLink = `https://wa.me/${ADMIN_WA}?text=Hello%2C+I+need+OTP+to+login+on+Lohagarh+Turf.+My+number+is+%2B91${phone}`;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) { toast.error('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    setSmsFailed(false);
    try {
      const token = await sendOtp(cleaned);
      setOtpToken(token);
      setStep('otp');
      toast.success('OTP sent to your mobile number!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      // SMS failed — show WhatsApp fallback on the same screen
      if (msg.toLowerCase().includes('sms failed') || msg.toLowerCase().includes('failed')) {
        setSmsFailed(true);
        toast.error('SMS could not be delivered. Please use WhatsApp below.');
      } else {
        toast.error(msg || 'Failed to send OTP. Please try again.');
      }
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
                  <span className="px-4 py-3 bg-gray-50 text-gray-600 font-medium text-sm border-r border-gray-200">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setSmsFailed(false); }}
                    placeholder="9876543210"
                    maxLength={10}
                    className="flex-1 px-4 py-3 text-gray-900 outline-none text-sm"
                    required
                  />
                  <Phone className="w-4 h-4 text-gray-400 mr-4" />
                </div>
                <p className="text-xs text-gray-400 mt-2">We&apos;ll send a 6-digit OTP via SMS</p>
              </div>

              <button type="submit" disabled={loading || phone.length < 10}
                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP…
                  </span>
                ) : 'Send OTP via SMS'}
              </button>

              {/* WhatsApp fallback — shown after SMS failure OR always as option */}
              <div className={`rounded-xl border p-4 text-center transition-all ${smsFailed ? 'border-green-300 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                <p className="text-xs text-gray-500 mb-2">
                  {smsFailed ? '⚠️ SMS failed — get OTP via WhatsApp instead:' : 'Or get OTP on WhatsApp:'}
                </p>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#1ebe5d] transition-colors">
                  <WhatsAppIcon />
                  WhatsApp 7793014321
                </a>
                <p className="text-xs text-gray-400 mt-2">Admin will send OTP to your WhatsApp</p>
              </div>
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
                <p className="text-xs text-gray-400 mt-2 text-center">Check SMS or WhatsApp for the OTP</p>
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

              {/* WhatsApp option on OTP screen too */}
              <div className="text-center pt-1">
                <p className="text-xs text-gray-400 mb-2">Didn&apos;t receive OTP?</p>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] font-semibold text-sm hover:underline">
                  <WhatsAppIcon />
                  Ask on WhatsApp 7793014321
                </a>
              </div>

              <button type="button" onClick={() => { setStep('phone'); setOtp(''); setOtpToken(null); setSmsFailed(false); }}
                className="w-full text-center text-sm text-gray-500 hover:text-green-600 flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Change Number
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing you agree to our{' '}
          <Link href="/terms" className="text-green-600 hover:underline">Terms & Conditions</Link>
        </p>
        <p className="text-center mt-3">
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
