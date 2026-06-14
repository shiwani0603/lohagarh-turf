'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Clock, Wifi, Car, Shield, ShoppingBag, Zap, Leaf } from 'lucide-react';

const PRICING = [
  { days: 'Monday – Friday', period: 'Day Time (5am – 5pm)', price: 599, icon: '☀️' },
  { days: 'Monday – Friday', period: 'Night Time (6pm – 11pm)', price: 699, icon: '🌙' },
  { days: 'Saturday – Sunday', period: 'Day Time (5am – 5pm)', price: 699, icon: '☀️' },
  { days: 'Saturday – Sunday', period: 'Night Time (6pm – 11pm)', price: 799, icon: '🌙' },
];

const FACILITIES = [
  { icon: <Leaf className="w-7 h-7 text-green-600" />, name: 'Artificial Turf', desc: 'Premium synthetic turf surface' },
  { icon: <Zap className="w-7 h-7 text-yellow-500" />, name: 'Flood Lights', desc: 'Full illumination for night play' },
  { icon: <Car className="w-7 h-7 text-gray-600" />, name: 'Free Parking', desc: 'Ample parking space' },
  { icon: <Shield className="w-7 h-7 text-indigo-600" />, name: 'CCTV Security', desc: 'Round-the-clock monitoring' },
  { icon: <ShoppingBag className="w-7 h-7 text-orange-500" />, name: 'Canteen', desc: 'Refreshments & snacks available' },
  { icon: <Wifi className="w-7 h-7 text-purple-500" />, name: 'Online Booking', desc: 'Book in seconds, anytime' },
];

export default function Home() {
  return (
    <div className="pt-16">
      {/* ── Pricing Banner ── */}
      <section className="bg-sky-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <Image src="/logo.png" alt="Lohagarh Turf" width={80} height={80} className="h-20 w-auto"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Lohagarh Turf</h1>
                  <p className="text-gray-500 text-sm">Bharatpur&apos;s Premier Sports Facility</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRICING.map((p, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{p.days}</span>
                      <span className="text-lg">{p.icon}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{p.period}</p>
                    <p className="text-2xl font-bold text-green-600">₹{p.price}<span className="text-sm font-normal text-gray-400">/hr</span></p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <Link href="/book" className="flex-1 text-center bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors">
                  Book Now
                </Link>
                <a href="tel:7793014321" className="flex-1 text-center border-2 border-green-600 text-green-600 font-semibold py-3 rounded-xl hover:bg-green-50 transition-colors">
                  Call Us
                </a>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-center text-center">
              <div className="text-8xl mb-3">⚽</div>
              <p className="text-gray-500 text-sm max-w-xs">Football · Box Cricket · Frisbee & more</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── (swapped above Contact) */}
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

      {/* ── Contact + Map ── (swapped below How to Book) */}
      <section className="bg-gray-900 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-600/20 rounded-full p-3 mt-1">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold text-sm uppercase tracking-wide mb-1">Phone</p>
                  <a href="tel:7793014321" className="text-white text-lg font-semibold hover:text-green-400 transition-colors">7793014321</a>
                  <p className="text-gray-400 text-sm">Available 24/7 for bookings</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-600/20 rounded-full p-3 mt-1">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold text-sm uppercase tracking-wide mb-1">Address</p>
                  <p className="text-white font-semibold">Lohagarh Turf</p>
                  <p className="text-gray-400 text-sm">Beside Keoladeo National Park<br />Bharatpur, Rajasthan — 321001</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-600/20 rounded-full p-3 mt-1">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold text-sm uppercase tracking-wide mb-1">Operating Hours</p>
                  <p className="text-white font-semibold">5:00 AM – 12:00 AM</p>
                  <p className="text-gray-400 text-sm">7 days a week · All slots bookable online</p>
                </div>
              </div>
              <a href="https://maps.app.goo.gl/sLc4DVE2qwpSUL256" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold">
                <MapPin className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>

            {/* Updated Google Map embed */}
            <div className="rounded-2xl overflow-hidden shadow-xl h-64 lg:h-80">
              <iframe
                src="https://maps.google.com/maps?q=Lohagarh+Turf+Bharatpur+Rajasthan&output=embed&z=16"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Lohagarh Turf Location" />
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Bharatpur&apos;s Premier<br />Sports Facility
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Located beside the famous <strong>Keoladeo National Park</strong> in Bharatpur, Rajasthan,
                Lohagarh Turf offers a world-class sports experience for cricket, football, frisbee, and more.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether it&apos;s a corporate tournament, a school sports day, a birthday party, or a casual match
                with friends — our professionally maintained 6000+ sq ft turf is available from 5am to midnight.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Turf Size', value: '6000+ sq ft' },
                  { label: 'Open', value: '5am – 12am' },
                  { label: 'Sports', value: 'Football, Cricket & more' },
                  { label: 'Location', value: 'Bharatpur, Raj.' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-4">
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

      {/* ── Facilities ── (Commentary System removed) */}
      <section id="amenities" className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-2">WHAT WE OFFER</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Facilities &amp; Amenities</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {FACILITIES.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex justify-center mb-3">{f.icon}</div>
                <p className="font-bold text-gray-800 text-sm mb-1">{f.name}</p>
                <p className="text-gray-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
