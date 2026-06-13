'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Calendar, Users, Tag, FileText, TrendingUp, CheckCircle, Clock, X } from 'lucide-react';

interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalUsers: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

export default function AdminDashboard() {
  const { user, userProfile, token, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (userProfile && !isAdmin) { router.push('/'); return; }
    if (isAdmin && token) fetchStats();
  }, [user, userProfile, isAdmin, token]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setStats(await res.json());
    } catch { /* */ } finally { setLoading(false); }
  };

  if (!isAdmin) return null;

  const statCards = stats ? [
    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
    { label: "Today's Bookings", value: stats.todayBookings, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Verification', value: stats.pendingBookings, icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Confirmed Bookings', value: stats.confirmedBookings, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ] : [];

  const quickLinks = [
    { label: 'Manage Bookings', href: '/admin/bookings', icon: Calendar, desc: 'View, confirm, and cancel bookings' },
    { label: 'Manage Users', href: '/admin/users', icon: Users, desc: 'View user profiles and history' },
    { label: 'Manage Coupons', href: '/admin/coupons', icon: Tag, desc: 'Create and manage discount coupons' },
    { label: 'Site Content', href: '/admin/content', icon: FileText, desc: 'Edit Terms, Contact info, etc.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-green-600" /> Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">Lohagarh Turf — Management Panel</p>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-green-600 border border-gray-200 px-3 py-2 rounded-lg">
            View Site
          </Link>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {statCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-3`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Links */}
        <h2 className="font-bold text-gray-800 text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(l => {
            const Icon = l.icon;
            return (
              <Link key={l.label} href={l.href}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:border-green-300 hover:shadow-md transition-all group">
                <div className="bg-green-50 rounded-xl p-3 inline-flex mb-3 group-hover:bg-green-100 transition-colors">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <p className="font-bold text-gray-800 mb-1">{l.label}</p>
                <p className="text-xs text-gray-500">{l.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
