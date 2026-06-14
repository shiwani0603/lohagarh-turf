'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Clock, Instagram } from 'lucide-react';

export default function Footer() {
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP?.replace('+', '') || '917793014321';

  return (
    <>
      {/* WhatsApp Float Button */}
      <a href={`https://wa.me/${adminPhone}?text=Hello%2C%20I%20want%20to%20book%20Lohagarh%20Turf.`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full p-3.5 shadow-lg hover:bg-green-600 transition-all hover:scale-110"
        title="Chat on WhatsApp">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/logo.png" alt="Lohagarh Turf" width={38} height={38} className="h-9 w-auto"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="font-bold text-white text-base">Lohagarh Turf</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-500 mb-4">
                Premium sports turf beside Keoladeo National Park, Bharatpur, Rajasthan. Book online anytime.
              </p>
              <div className="space-y-2 text-xs text-gray-500 mb-4">
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-green-500" />7793014321</p>
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-green-500" />Bharatpur, Rajasthan</p>
                <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-green-500" />5:00 AM – 12:00 AM</p>
              </div>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a href="https://instagram.com/lohagarhturf" target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-pink-400 transition-colors" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={`https://wa.me/${adminPhone}`} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-green-400 transition-colors" title="WhatsApp">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                {[['Home', '/'], ['Book Now', '/book'], ['Contact', '/contact'], ['About', '/#about']].map(([l, h]) => (
                  <li key={l}><Link href={h} className="hover:text-green-400 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-xs">
                {[['Login / Signup', '/login'], ['My Profile', '/profile'], ['My Bookings', '/profile']].map(([l, h]) => (
                  <li key={l}><Link href={h} className="hover:text-green-400 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-xs">
                {[['Terms & Conditions', '/terms'], ['Contact Us', '/contact']].map(([l, h]) => (
                  <li key={l}><Link href={h} className="hover:text-green-400 transition-colors">{l}</Link></li>
                ))}
              </ul>
              <div className="mt-6 text-xs text-gray-500 leading-relaxed">
                Beside Keoladeo National Park,<br />Bharatpur, Rajasthan — 321001
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Lohagarh Turf. All rights reserved.</p>
            <p>Bharatpur, Rajasthan · 7793014321</p>
            <p>
              Created by{' '}
              <a href="https://logic3s.com" target="_blank" rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 transition-colors font-medium">
                Logic3s.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
