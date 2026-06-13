'use client';

import { useEffect, useState } from 'react';

export default function TermsPage() {
  const [content, setContent] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/content?key=terms')
      .then(r => r.json())
      .then(d => setContent(d))
      .catch(() => setContent({
        title: 'Terms and Conditions',
        content: `
# Terms and Conditions

**Lohagarh Turf — Bharatpur, Rajasthan**

Last updated: June 2026

## 1. Booking Policy
- All bookings are subject to availability.
- A slot is only confirmed after payment verification by admin.
- You will receive WhatsApp confirmation once payment is verified.

## 2. Payment Policy
- Payment must be made via GPay or PhonePe QR code.
- Upload payment screenshot and transaction reference after payment.
- Admin will verify and confirm within 30 minutes during business hours.

## 3. Cancellation Policy
- Cancellations must be made at least 2 hours before the scheduled slot.
- Refund is subject to admin approval and may take 2–3 business days.
- No refund for cancellations made less than 1 hour before the slot.

## 4. Rules & Regulations
- Arrive at least 5 minutes before your scheduled time.
- Outside food and beverages are not permitted inside the turf.
- Spiked shoes are not allowed on the artificial turf.
- CCTV cameras are operational for security purposes.
- Physical altercations or misconduct will result in immediate removal.

## 5. Liability
- Lohagarh Turf is not liable for personal injuries during play.
- Please play safely and follow all posted safety guidelines.

## Contact
For any queries, WhatsApp us or call **7777777777**
        `,
      }));
  }, []);

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-gray-900 mb-4 mt-6">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-gray-800 mb-3 mt-5">{line.slice(3)}</h2>;
      if (line.startsWith('- ')) return <li key={i} className="text-gray-600 ml-4 mb-1">{line.slice(2)}</li>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-gray-700 mb-2">{line.slice(2, -2)}</p>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-gray-600 mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{content?.title || 'Terms and Conditions'}</h1>
          <div className="prose max-w-none">
            {content ? renderContent(content.content) : (
              <div className="animate-pulse space-y-3">
                {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
