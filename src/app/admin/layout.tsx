'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const SIDEBAR_LINKS = [
  { label: 'Dashboard',    href: '/admin',            icon: '📊' },
  { label: 'Bookings',     href: '/admin/bookings',   icon: '📅' },
  { label: 'Time Slots',   href: '/admin/time-slots', icon: '⏰' },
  { label: 'Settings',     href: '/admin/settings',   icon: '⚙️' },
  { label: 'Coupons',      href: '/admin/coupons',    icon: '🎫' },
  { label: 'Reviews',      href: '/admin/reviews',    icon: '⭐' },
  { label: 'Users',        href: '/admin/users',      icon: '👥' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const isLogin  = pathname === '/admin/login';

  const [ready,     setReady]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLogin) { setReady(true); return; }
    const ok = localStorage.getItem('adminLoggedIn');
    if (!ok) { router.replace('/admin/login'); } else { setReady(true); }
  }, [isLogin, router]);

  // Login page — no sidebar, just render children
  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    router.replace('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-56 bg-gray-900 flex flex-col transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-700 flex-shrink-0">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="h-8 w-auto" />
          <div>
            <p className="text-white text-sm font-bold leading-tight">Admin Panel</p>
            <p className="text-gray-500 text-xs">Lohagarh Turf</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {SIDEBAR_LINKS.map(l => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}>
                <span className="text-base">{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="flex-shrink-0 p-3 border-t border-gray-700 space-y-1">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
            <span>🌐</span> View Website
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-white hover:bg-red-600 transition-colors">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm font-semibold text-gray-900 lg:ml-0 ml-2">
            {SIDEBAR_LINKS.find(l => l.href === pathname)?.label ?? 'Admin'}
          </h1>
          <button onClick={handleLogout}
            className="text-xs text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors">
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
