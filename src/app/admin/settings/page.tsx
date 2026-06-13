'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName:    'Lohagarh Turf',
    aboutText:   'Located beside the famous Keoladeo National Park in Bharatpur, Rajasthan, Lohagarh Turf offers a world-class sports experience for cricket, football, futsal, and more.',
    phone1:      '7777777777',
    phone2:      '',
    phone3:      '',
    address:     'Lohagarh Turf, Beside Keoladeo National Park, Bharatpur, Rajasthan',
    mapUrl:      'https://maps.app.goo.gl/sLc4DVE2qwpSUL256',
    bookingPrice:'500',
    facebook:    '',
    instagram:   '',
    youtube:     '',
    termsText:   'Bookings are non-transferable. Cancellation must be requested at least 24 hours before the slot. Refunds are subject to admin approval.',
    refundText:  'Refunds will be processed within 5-7 business days after admin approval. No refund for cancellations within 24 hours of the slot.',
    privacyText: 'We collect only the information necessary to process your booking. Your personal data is never shared with third parties.',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings(p => ({ ...p, [k]: e.target.value }));

  const save = (section: string) => toast.success(`${section} saved successfully!`);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">Website Settings</h2>
        <p className="text-gray-500 text-sm mt-0.5">Manage all website content from here.</p>
      </div>

      {/* General */}
      <Card title="General" icon="🏷️">
        <Field label="Website Name"><input value={settings.siteName} onChange={set('siteName')} className="form-input" /></Field>
        <Field label="Booking Price per Slot (₹)">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">₹</span>
            <input type="number" value={settings.bookingPrice} onChange={set('bookingPrice')} className="px-3 py-2.5 text-sm flex-1 outline-none focus:ring-1 focus:ring-green-400" />
          </div>
        </Field>
        <div className="flex justify-end"><SaveBtn onClick={() => save('General')} /></div>
      </Card>

      {/* About */}
      <Card title="About Section" icon="ℹ️">
        <Field label="About Text">
          <textarea value={settings.aboutText} onChange={set('aboutText')} rows={4} className="form-input resize-none" />
        </Field>
        <div className="flex justify-end"><SaveBtn onClick={() => save('About')} /></div>
      </Card>

      {/* Contact */}
      <Card title="Contact Information" icon="📞">
        <Field label="Phone 1 (Primary)"><input value={settings.phone1} onChange={set('phone1')} className="form-input" /></Field>
        <Field label="Phone 2 (Optional)"><input value={settings.phone2} onChange={set('phone2')} className="form-input" placeholder="Optional" /></Field>
        <Field label="Phone 3 (Optional)"><input value={settings.phone3} onChange={set('phone3')} className="form-input" placeholder="Optional" /></Field>
        <Field label="Address"><input value={settings.address} onChange={set('address')} className="form-input" /></Field>
        <Field label="Google Map Link"><input value={settings.mapUrl} onChange={set('mapUrl')} className="form-input" /></Field>
        <div className="flex justify-end"><SaveBtn onClick={() => save('Contact')} /></div>
      </Card>

      {/* Social */}
      <Card title="Social Media Links" icon="🔗">
        <Field label="Facebook URL"><input value={settings.facebook} onChange={set('facebook')} className="form-input" placeholder="https://facebook.com/…" /></Field>
        <Field label="Instagram URL"><input value={settings.instagram} onChange={set('instagram')} className="form-input" placeholder="https://instagram.com/…" /></Field>
        <Field label="YouTube URL"><input value={settings.youtube} onChange={set('youtube')} className="form-input" placeholder="https://youtube.com/…" /></Field>
        <div className="flex justify-end"><SaveBtn onClick={() => save('Social Media')} /></div>
      </Card>

      {/* Legal */}
      <Card title="Terms & Conditions" icon="📋">
        <Field label="Terms & Conditions Text">
          <textarea value={settings.termsText} onChange={set('termsText')} rows={4} className="form-input resize-none" />
        </Field>
        <div className="flex justify-end"><SaveBtn onClick={() => save('Terms')} /></div>
      </Card>

      <Card title="Refund Policy" icon="💸">
        <Field label="Refund Policy Text">
          <textarea value={settings.refundText} onChange={set('refundText')} rows={4} className="form-input resize-none" />
        </Field>
        <div className="flex justify-end"><SaveBtn onClick={() => save('Refund Policy')} /></div>
      </Card>

      <Card title="Privacy Policy" icon="🔒">
        <Field label="Privacy Policy Text">
          <textarea value={settings.privacyText} onChange={set('privacyText')} rows={4} className="form-input resize-none" />
        </Field>
        <div className="flex justify-end"><SaveBtn onClick={() => save('Privacy Policy')} /></div>
      </Card>
    </div>
  );
}

function Card({ title, icon, children }: { title:string; icon:string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
        <span className="text-lg">{icon}</span>
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label:string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      {children}
    </div>
  );
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition-colors">
      Save Changes
    </button>
  );
}
