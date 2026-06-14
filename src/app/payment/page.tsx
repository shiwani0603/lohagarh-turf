'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatTime } from '@/lib/pricing';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Shield, CheckCircle, Upload, ArrowLeft, Copy, Check } from 'lucide-react';
import TnCModal from '@/components/TnCModal';

export default function PaymentPage() {
  const { user, token } = useAuth();
  const { items, finalTotal, coupon, clearCart } = useCart();
  const router = useRouter();

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTnC, setShowTnC] = useState(false);
  const [txnRef, setTxnRef] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [upiId, setUpiId] = useState(process.env.NEXT_PUBLIC_UPI_ID || '');

  const upiName = 'Lohagarh Turf';
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent('Lohagarh Turf Booking')}`;

  useEffect(() => {
    if (!user) { router.push('/login?redirect=/payment'); return; }
    if (items.length === 0) router.push('/book');
  }, [user, items, router]);

  // Fetch UPI ID from database (admin can update it)
  useEffect(() => {
    fetch('/api/admin/content?key=upi_id')
      .then(r => r.json())
      .then(d => { if (d.content) setUpiId(d.content); })
      .catch(() => {});
  }, []);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setScreenshot(e.target.files[0]);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) { toast.error('Please agree to Terms & Conditions'); return; }
    if (!txnRef.trim()) { toast.error('Please enter the transaction reference number'); return; }
    if (!screenshot) { toast.error('Please upload payment screenshot'); return; }
    if (!token) { toast.error('Session expired. Please login again.'); router.push('/login'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      formData.append('txnRef', txnRef);
      formData.append('paymentMethod', 'upi');
      formData.append('bookings', JSON.stringify(items));
      formData.append('totalAmount', finalTotal.toString());
      formData.append('couponCode', coupon?.code || '');
      formData.append('discountAmount', (coupon?.discount || 0).toString());

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Booking failed');
      }

      setConfirmed(true);
      clearCart();
      toast.success('Booking submitted! We will confirm via WhatsApp soon.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 pt-20">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h1>
          <p className="text-gray-500 mb-6">
            Your booking request has been submitted. Admin will verify your payment and
            confirm your slot via <strong>WhatsApp</strong> within a few minutes.
          </p>
          <div className="bg-green-50 rounded-xl p-4 mb-6 text-sm text-green-700">
            <p>📱 You&apos;ll receive WhatsApp confirmation shortly</p>
            <p className="mt-1">📋 View your bookings in My Profile</p>
          </div>
          <div className="flex gap-3">
            <Link href="/profile" className="flex-1 text-center bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700">
              My Bookings
            </Link>
            <Link href="/book" className="flex-1 text-center border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50">
              Book Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/book" className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h1>

        {/* Booking Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
          <h2 className="font-bold text-gray-800 mb-4">Booking Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Calendar className="w-3 h-3" />
                    {format(parseISO(item.date), 'd MMMM yyyy')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatTime(item.startTime)} – {formatTime(item.endTime)} ({item.durationHours}hr)
                  </div>
                </div>
                <p className="font-bold text-green-600">₹{item.totalPrice}</p>
              </div>
            ))}
          </div>
          {coupon && (
            <div className="flex justify-between text-sm text-green-600 border-t pt-3 mb-2">
              <span>Coupon ({coupon.code})</span><span>–₹{coupon.discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-3">
            <span>Total Amount</span>
            <span className="text-green-600">₹{finalTotal}</span>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" /> Terms & Conditions
          </h2>
          <ul className="text-sm text-gray-600 space-y-1.5 mb-4 list-disc list-inside">
            <li>Slots are blocked once payment is confirmed by admin.</li>
            <li>Cancellations must be made at least 2 hours before the slot.</li>
            <li>Refund policy is subject to admin approval.</li>
            <li>Please arrive 5 minutes before your scheduled time.</li>
            <li>Outside food and drinks are not allowed inside the turf.</li>
          </ul>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
            <span className="text-sm text-gray-700">
              I agree to the{' '}
              <button type="button" onClick={() => setShowTnC(true)}
                className="text-green-600 hover:underline font-medium">
                Terms &amp; Conditions
              </button>
            </span>
          </label>
        </div>

        {/* UPI Payment Section */}
        <div className={`bg-white rounded-2xl shadow-sm border p-6 mb-5 transition-opacity ${!agreedToTerms ? 'opacity-40 pointer-events-none' : ''}`}>
          <h2 className="font-bold text-gray-800 mb-2">Pay via UPI</h2>
          <p className="text-xs text-gray-500 mb-5">Works with GPay, PhonePe, Paytm, BHIM &amp; all UPI apps</p>

          {/* Dynamic QR — amount pre-filled */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center mb-6 border border-green-100">
            <p className="text-sm font-semibold text-gray-700 mb-1">Scan to pay</p>
            <p className="text-3xl font-bold text-green-600 mb-5">₹{finalTotal}</p>

            {upiId ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 inline-block">
                    <QRCode
                      value={upiLink}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#16a34a"
                      level="M"
                    />
                  </div>
                </div>

                {/* UPI ID copy */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-xs text-gray-500">UPI ID:</span>
                  <span className="text-sm font-semibold text-gray-800">{upiId}</span>
                  <button onClick={copyUpiId}
                    className="text-green-600 hover:text-green-700 p-1 rounded-lg hover:bg-green-50 transition-colors"
                    title="Copy UPI ID">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* App logos */}
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl" title="Google Pay">🔵</span>
                  <span className="text-xl" title="PhonePe">🟣</span>
                  <span className="text-xl" title="Paytm">🔷</span>
                  <span className="text-xs text-gray-400 ml-1">&amp; all UPI apps</span>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-400 text-sm">UPI ID not configured.</p>
                <p className="text-gray-400 text-xs mt-1">Admin: add NEXT_PUBLIC_UPI_ID to .env.local</p>
              </div>
            )}
          </div>

          {/* Step-by-step instructions */}
          <div className="bg-blue-50 rounded-xl p-4 mb-5 text-sm text-blue-700">
            <p className="font-semibold mb-2">How to pay:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Open GPay / PhonePe / Paytm on your phone</li>
              <li>Tap <strong>Scan QR</strong> and scan the code above</li>
              <li>Amount ₹{finalTotal} will be pre-filled — just tap Pay</li>
              <li>Copy the <strong>transaction ID</strong> from the payment success screen</li>
              <li>Paste it below and upload a screenshot</li>
            </ol>
          </div>

          {/* Transaction Reference */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Transaction ID / Reference Number *
            </label>
            <input type="text" value={txnRef} onChange={e => setTxnRef(e.target.value)}
              placeholder="e.g. 123456789012"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" />
            <p className="text-xs text-gray-400 mt-1">
              Found on the payment success screen in your UPI app
            </p>
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Payment Screenshot *
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              {screenshot ? (
                <p className="text-sm font-medium text-green-600">{screenshot.name}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-500">Tap to upload payment screenshot</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 5MB)</p>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
            </label>
          </div>
        </div>

        <button onClick={handleSubmit}
          disabled={loading || !agreedToTerms || !txnRef || !screenshot}
          className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-green-200">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting Booking…
            </span>
          ) : `Confirm Booking — ₹${finalTotal}`}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Your slot will be confirmed after payment verification via WhatsApp
        </p>
      </div>

      {showTnC && <TnCModal onClose={() => setShowTnC(false)} />}
    </div>
  );
}
