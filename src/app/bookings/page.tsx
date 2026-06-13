'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const basePrice = 500;
  const discountAmount = (basePrice * discount) / 100;
  const finalAmount = basePrice - discountAmount;

  const handleApplyCoupon = () => {
    if (!couponCode) {
      toast.error('Please enter a coupon code');
      return;
    }
    // TODO: Validate coupon from API
    setDiscount(10);
    toast.success('Coupon applied!');
  };

  const handleBook = () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select date and time slot');
      return;
    }
    // TODO: Create booking
    toast.success('Proceeding to payment...');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <h1 className="text-4xl font-bold mb-8 text-center">Book Your Turf</h1>

        <div className="max-w-2xl mx-auto">
          {/* Booking Form Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>

            {/* Time Slot Selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3">Select Time Slot</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: '1', time: '6:00 AM - 7:00 AM' },
                  { id: '2', time: '7:00 AM - 8:00 AM' },
                  { id: '3', time: '5:00 PM - 6:00 PM' },
                  { id: '4', time: '6:00 PM - 7:00 PM' },
                  { id: '5', time: '7:00 PM - 8:00 PM' },
                  { id: '6', time: '8:00 PM - 9:00 PM' },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-3 rounded-lg border-2 transition font-semibold ${
                      selectedSlot === slot.id
                        ? 'border-green-600 bg-green-50 text-green-600'
                        : 'border-gray-300 text-gray-700 hover:border-green-600'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mb-6 pb-6 border-b">
              <label className="block text-lg font-semibold mb-3">Apply Coupon (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-gray-700">Base Price:</span>
                <span className="font-semibold">₹{basePrice}</span>
              </div>
              {discount > 0 && (
                <>
                  <div className="flex justify-between mb-3 text-green-600">
                    <span>Discount ({discount}%):</span>
                    <span>-₹{discountAmount.toFixed(0)}</span>
                  </div>
                  <hr className="my-3" />
                </>
              )}
              <div className="flex justify-between text-xl font-bold text-green-600">
                <span>Final Amount:</span>
                <span>₹{finalAmount.toFixed(0)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBook}
                className="flex-1 btn-primary text-lg"
              >
                Proceed to Payment
              </button>
              <Link href="/" className="flex-1 btn-outline text-center text-lg">
                Cancel
              </Link>
            </div>

            {/* Note */}
            <p className="text-sm text-gray-600 mt-6 text-center">
              💡 You need to be logged in to make a booking.{' '}
              <Link href="/login" className="text-green-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
