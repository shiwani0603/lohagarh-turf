'use client';

import { useEffect, useState } from 'react';
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<{ phone: string; address: string; hours: string } | null>(null);
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP?.replace('+', '') || '917777777777';

  useEffect(() => {
    fetch('/api/admin/content?key=contact_info')
      .then(r => r.json())
      .then(d => {
        try { setContactInfo(JSON.parse(d.content)); } catch { /* */ }
      })
      .catch(() => { /* use defaults */ });
  }, []);

  const phone = contactInfo?.phone || '7777777777';
  const address = contactInfo?.address || 'Beside Keoladeo National Park, Bharatpur, Rajasthan';
  const hours = contactInfo?.hours || '5:00 AM – 12:00 AM (midnight)';

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-500">We&apos;re available 24/7 for bookings and enquiries</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Get In Touch</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-xl p-3"><Phone className="w-5 h-5 text-green-600" /></div>
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <a href={`tel:${phone}`} className="text-green-600 hover:text-green-700">{phone}</a>
                    <p className="text-gray-400 text-xs mt-0.5">Available 24/7 for bookings</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-xl p-3"><MapPin className="w-5 h-5 text-green-600" /></div>
                  <div>
                    <p className="font-semibold text-gray-800">Address</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-xl p-3"><Clock className="w-5 h-5 text-green-600" /></div>
                  <div>
                    <p className="font-semibold text-gray-800">Operating Hours</p>
                    <p className="text-gray-600 text-sm">{hours}</p>
                    <p className="text-gray-400 text-xs mt-0.5">7 days a week · All slots bookable online</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <a href={`https://wa.me/${adminPhone}?text=Hello%2C%20I%20want%20to%20enquire%20about%20Lohagarh%20Turf%20booking.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </a>
                <a href="https://maps.app.goo.gl/j3WPLqvfji44WfYq6" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <MapPin className="w-5 h-5" /> Get Directions
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-3">Sports Available</h3>
              <div className="flex flex-wrap gap-2">
                {['Football', 'Box Cricket', 'Frisbee', 'Any Turf Game'].map(s => (
                  <span key={s} className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.8!2d77.49!3d27.217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397370b9ca0e3e3f%3A0x3b2b3b3b3b3b3b3b!2sKeoladeo%20National%20Park!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{ border: 0, minHeight: '400px' }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Lohagarh Turf Location" />
          </div>
        </div>
      </div>
    </div>
  );
}
