'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Phone, KeyRound, ArrowLeft, AlertCircle } from 'lucide-react';

// Hardcoded — no env var dependency
const WA_NUMBER = '917793014321';
const WA_DISPLAY = '7793014321';

function WaIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
  const [smsError, setSmsError] = useState<string | null>(null);
  const { sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const waLink = (msg: string) =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) { toast.error('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    setSmsError(null);
    try {
      const result = await sendOtp(cleaned);
      setOtpToken(result.token);

      if (result.smsFailed) {
        // SMS failed but we still advance — admin sends OTP via WhatsApp
        setSmsError(result.error || 'SMS delivery failed');
        setStep('otp');
        toast.error('SMS failed — use WhatsApp below to get your OTP');
      } else {
        setStep('otp');
        toast.success('OTP sent to your mobile!');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
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
      toast.error(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep('phone'); setOtp(''); setOtpToken(null); setSmsError(null); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="Lohagarh Turf" width={72} height={72}
              className="w-16 h-auto mx-auto mb-4"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'phone' ? 'Login / Sign Up' : 'Enter OTP'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 'phone' ? 'Enter your mobile number to continue' : `OTP sent to +91 ${phone}`}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">

          {step === 'phone' ? (
            <>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Mobile Number
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
                    <span className="px-4 py-3 bg-gray-50 text-gray-600 font-medium text-sm border-r border-gray-200">+91</span>
                    <input type="tel" value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210" maxLength={10}
                      className="flex-1 px-4 py-3 text-gray-900 outline-none text-sm" required />
                    <Phone className="w-4 h-4 text-gray-400 mr-4" />
                  </div>
                </div>
                <button type="submit" disabled={loading || phone.length < 10}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</span>
                    : 'Send OTP via SMS'}
                </button>
              </form>

              {/* WhatsApp alternative — always visible */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 text-center mb-3">OR get OTP directly on WhatsApp</p>
                <a href={waLink(`Hello, I want to login on Lohagarh Turf. My mobile number is +91${phone || 'XXXXXXXXXX'}. Please send me OTP.`)}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm">
                  <WaIcon /> WhatsApp {WA_DISPLAY}
                </a>
                <p className="text-xs text-gray-400 text-center mt-2">We&apos;ll send OTP to your WhatsApp</p>
              </div>
            </>
          ) : (
            <>
              {/* SMS error box — shows exact Fast2SMS reason */}
              {smsError && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-700 mb-1">SMS not delivered</p>
                    <p className="text-xs text-amber-600">{smsError}</p>
                    <a href={waLink(`Hello, I need OTP to login on Lohagarh Turf. My number is +91${phone}. SMS failed, please send OTP on WhatsApp.`)}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                      <WaIcon /> Ask on WhatsApp {WA_DISPLAY}
                    </a>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    6-Digit OTP
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
                    <input type="text" value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •" maxLength={6} autoFocus
                      className="flex-1 px-4 py-3.5 text-center text-2xl tracking-[0.5em] text-gray-900 outline-none font-bold"
                      required />
                    <KeyRound className="w-4 h-4 text-gray-400 mr-4" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center">Check SMS or WhatsApp</p>
                </div>
                <button type="submit" disabled={loading || otp.length !== 6}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</span>
                    : 'Verify & Login'}
                </button>
              </form>

              {!smsError && (
                <div className="border-t border-gray-100 pt-3 text-center">
                  <p className="text-xs text-gray-400 mb-2">Didn&apos;t receive SMS?</p>
                  <a href={waLink(`Hello, I need OTP for Lohagarh Turf login. My number is +91${phone}.`)}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#25D366] font-semibold text-sm hover:underline">
                    <WaIcon /> WhatsApp {WA_DISPLAY}
                  </a>
                </div>
              )}

              <button type="button" onClick={reset}
                className="w-full text-center text-sm text-gray-400 hover:text-green-600 flex items-center justify-center gap-1 pt-1">
                <ArrowLeft className="w-4 h-4" /> Change Number
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing you agree to our{' '}
          <Link href="/terms" className="text-green-600 hover:underline">Terms & Conditions</Link>
        </p>
        <p className="text-center mt-3">
          <Link href="/" className="text-xs text-gray-400 hover:text-green-600 flex items-center justify-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
