'use client';

import Link from 'next/link';

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s your booking information.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Stats Cards */}
          <div className="card">
            <div className="text-4xl mb-2">📅</div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Upcoming Bookings</h3>
            <p className="text-3xl font-bold">2</p>
          </div>
          <div className="card">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Completed Bookings</h3>
            <p className="text-3xl font-bold">5</p>
          </div>
          <div className="card">
            <div className="text-4xl mb-2">💰</div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Total Spent</h3>
            <p className="text-3xl font-bold">₹3,500</p>
          </div>
          <div className="card">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Total Bookings</h3>
            <p className="text-3xl font-bold">7</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Upcoming Bookings</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">Booking #BK001</h3>
                    <span className="badge badge-success">Confirmed</span>
                  </div>
                  <p className="text-gray-600 mb-2">📅 June 5, 2026 | ⏰ 6:00 PM - 7:00 PM</p>
                  <p className="text-lg font-semibold text-green-600">₹500</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/bookings" className="btn btn-primary w-full text-center">
                  Book Now
                </Link>
                <button className="btn btn-secondary w-full">
                  Download Receipt
                </button>
                <button className="btn btn-outline w-full">
                  View History
                </button>
                <Link href="/profile" className="btn btn-secondary w-full text-center">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
