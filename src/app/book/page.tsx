'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  DAY_SLOTS, NIGHT_SLOTS, SPORTS, SlotType,
  getDayType, getSlotType, getPricePerHour, formatTime, addHours, getMaxDuration,
} from '@/lib/pricing';
import { Calendar, Clock, ShoppingCart, Trash2, ChevronDown, Plus, Minus } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function BookPage() {
  const { user, token } = useAuth();
  const { items, addItem, removeItem, subtotal, coupon, finalTotal, applyCoupon, removeCoupon } = useCart();
  const router = useRouter();

  const [sport, setSport] = useState(SPORTS[0]);
  const [date, setDate] = useState(today());
  const [period, setPeriod] = useState<SlotType>('day');
  const [startTime, setStartTime] = useState(DAY_SLOTS[0]);
  const [duration, setDuration] = useState(1);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const slots = period === 'day' ? DAY_SLOTS : NIGHT_SLOTS;
  const dateObj = date ? parseISO(date) : new Date();
  const dayType = isValid(dateObj) ? getDayType(dateObj) : 'weekday';
  const pricePerHour = getPricePerHour(period, dayType);
  const maxDuration = getMaxDuration(startTime, period);
  const endTime = addHours(startTime, duration);
  const totalPrice = pricePerHour * duration;

  // Fetch booked slots for selected date
  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    fetch(`/api/slots/available?date=${date}`)
      .then(r => r.json())
      .then(d => setBookedSlots(d.bookedSlots || []))
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  // Reset startTime when period changes
  useEffect(() => {
    setStartTime(period === 'day' ? DAY_SLOTS[0] : NIGHT_SLOTS[0]);
    setDuration(1);
  }, [period]);

  // Clamp duration to max allowed
  useEffect(() => {
    if (duration > maxDuration) setDuration(Math.max(1, maxDuration));
  }, [startTime, period, maxDuration, duration]);

  function isSlotBooked(slot: string): boolean {
    const slotHour = parseInt(slot.split(':')[0]);
    return bookedSlots.some(b => {
      const [bStart, bEnd] = b.split('-');
      const bStartH = parseInt(bStart.split(':')[0]);
      const bEndH = parseInt(bEnd.split(':')[0]);
      return slotHour >= bStartH && slotHour < bEndH;
    });
  }

  const slotConflictsWithCart = (sTime: string, dur: number): boolean => {
    const sH = parseInt(sTime.split(':')[0]);
    const eH = sH + dur;
    return items.some(item => {
      if (item.date !== date) return false;
      const iSH = parseInt(item.startTime.split(':')[0]);
      const iEH = parseInt(item.endTime.split(':')[0]);
      return sH < iEH && eH > iSH;
    });
  };

  const handleAddToCart = () => {
    if (!date) { toast.error('Please select a date'); return; }
    if (duration < 1) { toast.error('Duration must be at least 1 hour'); return; }
    if (isSlotBooked(startTime)) { toast.error('This slot is already booked'); return; }
    if (slotConflictsWithCart(startTime, duration)) { toast.error('This slot conflicts with an item already in your cart'); return; }

    addItem({
      date, sport, startTime, endTime,
      durationHours: duration, slotType: period, dayType,
      pricePerHour, totalPrice,
    });
    toast.success('Added to cart!');
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!user) { toast.error('Login to apply coupons'); return; }
    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: couponCode.toUpperCase(), amount: subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        applyCoupon(couponCode.toUpperCase(), data.discount);
        toast.success(`Coupon applied! You save ₹${data.discount}`);
      } else {
        toast.error(data.error || 'Invalid coupon code');
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleProceed = () => {
    if (items.length === 0) { toast.error('Add at least one slot to cart'); return; }
    if (!user) {
      toast.error('Please login to proceed');
      router.push('/login?redirect=/book');
      return;
    }
    router.push('/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Now</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Booking Form ── */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Select Your Slot</h2>

            {/* Sport */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sports</label>
              <div className="relative">
                <select value={sport} onChange={e => setSport(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none bg-white">
                  {SPORTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Date</label>
              <div className="relative">
                <input type="date" value={date} min={today()}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none" />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {date && (
                <p className="text-xs text-gray-500 mt-1.5">
                  {format(parseISO(date), 'EEEE, d MMMM yyyy')} ·{' '}
                  <span className={`font-semibold ${dayType === 'weekend' ? 'text-orange-600' : 'text-green-600'}`}>
                    {dayType === 'weekend' ? 'Weekend' : 'Weekday'} Pricing
                  </span>
                </p>
              )}
            </div>

            {/* Period */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Time Period</label>
              <div className="grid grid-cols-2 gap-2">
                {(['day', 'night'] as SlotType[]).map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      period === p ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    {p === 'day' ? '☀️ Day (5am–5pm)' : '🌙 Night (6pm–11pm)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Time */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Start Time</label>
              <div className="relative">
                <select value={startTime} onChange={e => { setStartTime(e.target.value); setDuration(1); }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none bg-white">
                  {slots.map(s => (
                    <option key={s} value={s} disabled={isSlotBooked(s)}>
                      {formatTime(s)}{isSlotBooked(s) ? ' (Booked)' : ''}
                    </option>
                  ))}
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {loadingSlots && <p className="text-xs text-gray-400 mt-1">Checking availability…</p>}
            </div>

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Duration</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setDuration(d => Math.max(1, d - 1))}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-green-500 hover:text-green-600 transition-all disabled:opacity-40"
                  disabled={duration <= 1}>
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold text-gray-800 w-20 text-center">
                  {duration} Hr{duration > 1 ? 's' : ''}
                </span>
                <button onClick={() => setDuration(d => Math.min(maxDuration, d + 1))}
                  className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-700 transition-all disabled:opacity-40"
                  disabled={duration >= maxDuration}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {date && (
                <p className="text-xs text-gray-500 mt-2">
                  {formatTime(startTime)} → {formatTime(endTime)} · ₹{pricePerHour}/hr ·{' '}
                  <span className="font-bold text-green-600">Total: ₹{totalPrice}</span>
                </p>
              )}
            </div>

            <button onClick={handleAddToCart}
              className="w-full bg-gray-100 text-gray-500 font-bold py-3.5 rounded-xl hover:bg-green-600 hover:text-white transition-all">
              Add To Cart
            </button>
          </div>

          {/* ── Cart ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  Cart ({items.length})
                </h2>
                {items.length > 0 && (
                  <button onClick={() => { items.forEach(i => removeItem(i.id)); }}
                    className="text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Your cart is empty</p>
                  <p className="text-xs mt-1">Select a slot and add to cart</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-3 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                            <Calendar className="w-3 h-3" />
                            {format(parseISO(item.date), 'd MMM yyyy')}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(item.startTime)} – {formatTime(item.endTime)}
                          </div>
                          <p className="text-green-600 font-bold text-sm">₹{item.totalPrice}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 ml-2">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Coupon */}
                  {user && (
                    <div className="mb-4">
                      {coupon ? (
                        <div className="flex items-center justify-between bg-green-50 rounded-xl px-3 py-2">
                          <span className="text-green-700 text-sm font-semibold">{coupon.code} (–₹{coupon.discount})</span>
                          <button onClick={removeCoupon} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Coupon code"
                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-100 outline-none" />
                          <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode}
                            className="bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                            {couponLoading ? '…' : 'Apply'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t border-gray-100 pt-3 mb-4 space-y-1">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span><span>₹{subtotal}</span>
                    </div>
                    {coupon && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span><span>–₹{coupon.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Total</span><span>₹{finalTotal}</span>
                    </div>
                  </div>

                  <button onClick={handleProceed}
                    className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors">
                    {user ? `Proceed ₹${finalTotal}` : 'Login to Proceed'}
                  </button>

                  {!user && (
                    <p className="text-center text-xs text-gray-400 mt-2">
                      <Link href="/login?redirect=/book" className="text-green-600 hover:underline">Login / Sign Up</Link> to complete booking
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
