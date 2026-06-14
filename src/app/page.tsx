'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Clock, Wifi, Car, Shield, ShoppingBag, Zap, Leaf } from 'lucide-react';

const PRICING = [
  { days: 'Mon – Fri', period: 'Day Time', hours: '5 AM – 5 PM', price: 599, icon: '☀️', bg: 'from-amber-50 to-yellow-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  { days: 'Mon – Fri', period: 'Night Time', hours: '6 PM – 11 PM', price: 699, icon: '🌙', bg: 'from-indigo-50 to-blue-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700' },
  { days: 'Sat – Sun', period: 'Day Time', hours: '5 AM – 5 PM', price: 699, icon: '☀️', bg: 'from-amber-50 to-yellow-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  { days: 'Sat – Sun', period: 'Night Time', hours: '6 PM – 11 PM', price: 799, icon: '🌙', bg: 'from-indigo-50 to-blue-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700' },
];

const FACILITIES = [
  { icon: <Leaf className="w-7 h-7 text-green-600" />, name: 'Artificial Turf', desc: 'Premium synthetic turf surface' },
  { icon: <Zap className="w-7 h-7 text-yellow-500" />, name: 'Flood Lights', desc: 'Full illumination for night play' },
  { icon: <Car className="w-7 h-7 text-gray-600" />, name: 'Free Parking', desc: 'Ample parking space' },
  { icon: <Shield className="w-7 h-7 text-indigo-600" />, name: 'CCTV Security', desc: 'Round-the-clock monitoring' },
  { icon: <ShoppingBag className="w-7 h-7 text-orange-500" />, name: 'Canteen', desc: 'Refreshments & snacks available' },
  { icon: <Wifi className="w-7 h-7 text-purple-500" />, name: 'Online Booking', desc: 'Book in seconds, anytime' },
];

const GAMES = [
  { emoji: '🏏', name: 'Box Cricket' },
  { emoji: '⚽', name: 'Football' },
  { emoji: '🥏', name: 'Frisbee' },
  { emoji: '🏃', name: 'Any Turf Game' },
];

const WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP?.replace('+', '') || '917793014321';
const MAP_EMBED = 'https://maps.google.com/maps?q=27.2041,77.5085&output=embed&z=17';
const MAP_LINK = 'https://maps.app.goo.gl/sLc4DVE2qwpSUL256';

export default function Home() {
  return (
    <div className="pt-16">

      {/* ── Hero / Pricing Banner ── */}
      <section className="bg-sky-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 w-full">
              {/* Logo + Title */}
              <div className="flex items-center gap-4 mb-4">
                <Image src="/logo.png" alt="Lohagarh Turf" width={80} height={80} className="h-20 w-auto"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Lohagarh Turf</h1>
                  <p className="text-gray-500 text-sm">Bharatpur&apos;s Premier Sports Facility</p>
                </div>
              </div>

              {/* Games row */}
              <div className="flex flex-wrap gap-2 mb-4">
                {GAMES.map(g => (
                  <span key={g.name} className="flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <span>{g.emoji}</span>{g.name}
                  </span>
                ))}
              </div>

              {/* Pricing cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {PRICING.map((p, i) => (
                  <div key={i} className={`bg-gradient-to-br ${p.bg} rounded-2xl p-4 border ${p.border}`}>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.badge}`}>{p.icon} {p.period}</span>
                    <p className="text-xs text-gray-500 font-medium mt-2 mb-0.5">{p.days}</p>
                    <p className="text-xs text-gray-400 mb-2">{p.hours}</p>
                    <p className="text-2xl font-extrabold text-gray-900">
                      ₹{p.price}<span className="text-sm font-normal text-gray-500">/hr</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link href="/book" className="flex-1 text-center bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors">
                  Book Now
                </Link>
                <a href="tel:7793014321" className="flex-1 text-center border-2 border-green-600 text-green-600 font-semibold py-3 rounded-xl hover:bg-green-50 transition-colors">
                  Call Us
                </a>
              </div>
            </div>

            {/* Right decoration */}
            <div className="hidden lg:flex flex-col items-center text-center">
              <div className="text-8xl mb-3">⚽</div>
              <p className="text-gray-500 text-sm max-w-xs">Box Cricket · Football · Frisbee &amp; more</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How to Book ── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-2">SIMPLE PROCESS</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-10">How to Book</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Select Date & Slot', desc: 'Choose your preferred date, time period (day/night) and duration.' },
              { step: '02', title: 'Pay Online', desc: 'Pay securely via GPay or PhonePe QR code. Quick and hassle-free.' },
              { step: '03', title: 'Get Confirmed', desc: 'Receive WhatsApp confirmation with your booking details instantly.' },
            ].map(s => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg mb-4">{s.step}</div>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/book" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-green-700 transition-colors text-lg shadow-lg shadow-green-200">
              Book Your Slot Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Bharatpur&apos;s Premier<br />Sports Facility
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Located beside the famous <strong>Keoladeo National Park</strong> in Bharatpur, Rajasthan,
                Lohagarh Turf offers a world-class sports experience for box cricket, football, frisbee, and more.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether it&apos;s a corporate tournament, a school sports day, a birthday party, or a casual match
                with friends — our professionally maintained 6000+ sq ft turf is available from 5am to midnight.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Turf Size', value: '6000+ sq ft' },
                  { label: 'Open', value: '5am – 12am' },
                  { label: 'Sports', value: 'Box Cricket, Football & more' },
                  { label: 'Location', value: 'Bharatpur, Raj.' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="font-bold text-gray-800 text-sm">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-3xl p-10 text-center">
                <div className="text-9xl mb-4">🏟️</div>
                <p className="text-green-700 font-bold text-xl">Premium Artificial Turf</p>
                <p className="text-gray-500 text-sm mt-2">Flood-lit · CCTV · Parking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Facilities ── */}
      <section id="amenities" className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-2">WHAT WE OFFER</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Facilities &amp; Amenities</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FACILITIES.map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex justify-center mb-3">{f.icon}</div>
                <p className="font-bold text-gray-800 text-sm mb-1">{f.name}</p>
                <p className="text-gray-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Us (just above footer) ── */}
      <section id="contact" className="bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-green-400 font-semibold text-sm uppercase tracking-widest mb-2">GET IN TOUCH</p>
            <h2 className="text-3xl font-bold text-white">Contact Us</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Contact details */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-green-600/20 rounded-full p-3 mt-1 shrink-0">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold text-xs uppercase tracking-wide mb-1">Call / WhatsApp</p>
                  <a href="tel:7793014321" className="text-white text-lg font-bold hover:text-green-400 transition-colors block">7793014321</a>
                  <a href={`https://wa.me/${WHATSAPP}?text=Hello%2C%20I%20want%20to%20book%20Lohagarh%20Turf.`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-600/20 rounded-full p-3 mt-1 shrink-0">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold text-xs uppercase tracking-wide mb-1">Address</p>
                  <p className="text-white font-bold">Lohagarh Turf</p>
                  <p className="text-gray-400 text-sm leading-relaxed">Beside Keoladeo National Park<br />Bharatpur, Rajasthan — 321001</p>
                  <a href={MAP_LINK} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-green-400 hover:text-green-300 text-xs font-semibold transition-colors">
                    <MapPin className="w-3.5 h-3.5" /> Open in Google Maps →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-600/20 rounded-full p-3 mt-1 shrink-0">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold text-xs uppercase tracking-wide mb-1">Operating Hours</p>
                  <p className="text-white font-bold text-lg">5:00 AM – 12:00 AM</p>
                  <p className="text-gray-400 text-sm">7 days a week · All slots bookable online</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-xl h-72 lg:h-80 border border-gray-700">
              <iframe
                src={MAP_EMBED}
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lohagarh Turf Location"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
