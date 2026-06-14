'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, logout, isAdmin } = useAuth();
  const { items } = useCart();

  const isHome = pathname === '/';
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenu(false);
    router.push('/');
  };

  const whatsappAdmin = () => {
    const phone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP?.replace('+', '') || '917793014321';
    window.open(`https://wa.me/${phone}?text=Hello%2C%20I%20need%20help%20with%20Lohagarh%20Turf%20booking.`, '_blank');
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      transparent ? 'bg-transparent' : 'bg-white shadow-sm border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Lohagarh Turf" width={40} height={40}
              className="h-10 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className={`font-bold text-lg transition-colors ${transparent ? 'text-white' : 'text-gray-900'}`}>
              Lohagarh Turf
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {[['Play', '/#about'], ['Book', '/book'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${transparent ? 'text-gray-100' : 'text-gray-600'}`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* WhatsApp button */}
            <button onClick={whatsappAdmin}
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${transparent ? 'text-green-200 hover:text-white' : 'text-green-600 hover:text-green-700'}`}>
              <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>

            {/* Cart */}
            {user && (
              <Link href="/book" className={`relative p-2 rounded-lg transition-colors ${transparent ? 'text-gray-100 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700">
                  <User className="w-4 h-4" />
                  {userProfile?.name || userProfile?.phone?.slice(-4) || 'Me'}
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 z-10">
                    <Link href="/profile" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"
                  className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                    transparent ? 'border-white/40 text-white hover:bg-white/10' : 'border-gray-200 text-gray-700 hover:border-green-500 hover:text-green-600'
                  }`}>
                  Login / Signup
                </Link>
                <Link href="/book"
                  className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-gray-700'}`}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {[['Play', '/#about'], ['Book', '/book'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-700">
                {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-2 space-y-2">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setOpen(false)} className="block text-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium text-sm rounded-lg">My Profile</Link>
                  {isAdmin && <Link href="/admin" onClick={() => setOpen(false)} className="block text-center bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-sm">Admin Panel</Link>}
                  <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full text-center bg-red-100 text-red-600 font-medium py-2.5 rounded-lg text-sm">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="block text-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium text-sm rounded-lg">Login / Signup</Link>
                  <Link href="/book" onClick={() => setOpen(false)} className="block text-center bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm">Book Now</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
