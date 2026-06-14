'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Booking, Payments & Cancellations',
    items: [
      { label: 'Slot Duration', text: 'The booking slot is strictly for the time reserved. Teams must vacate the turf immediately when their time ends so that subsequent sessions can commence on schedule.' },
      { label: 'Advance Payment', text: 'A booking is officially confirmed only upon receipt of the designated advance or full payment, as specified during the reservation system check-out.' },
      { label: 'Cancellation & Rescheduling', text: 'Requests to cancel or reschedule must be communicated at least 24 to 48 hours prior to the slot. Failure to do so will result in the forfeiture of the booking amount or deposit.' },
    ],
  },
  {
    title: '2. Footwear & Approved Gear Regulations',
    items: [
      { label: 'Approved Footwear', text: 'Only flat-soled sports shoes, indoor trainers, or specialized turf shoes (multi-studs) are permitted. Metal spikes, molds, or hard plastic studs are strictly banned as they permanently tear the artificial fibers.' },
      { label: 'Cricket Bats & Balls', text: 'Only standard tennis-cricket bats or indoor bats are permitted. Hard leather cricket balls are strictly prohibited.' },
      { label: 'Appropriate Attire', text: 'Players must be dressed in appropriate sportswear. Heavy jewelry, watches, or metal belt buckles must be removed prior to play.' },
    ],
    warning: { title: '⚠️ STRICTLY ENFORCED: ZERO TOLERANCE', lines: ['No Spitting anywhere on the turf surface.', 'No Food or Colored Drinks — only pure drinking water is allowed inside the cage.'] },
  },
  {
    title: '3. Property Damage & Equipment Liability',
    items: [
      { label: 'Damage to Turf', text: 'Any deliberate, negligent, or malicious damage to the artificial grass matting is heavily penalized.' },
      { label: 'Asset Abuse', text: 'Hitting, kicking, or hanging onto perimeter netting, roof nets, goalposts, or floodlighting poles is strictly forbidden.' },
      { label: 'Financial Liability', text: 'The individual booking the slot or the team captain will be held completely responsible for the full replacement or repair cost of any damaged facility asset.' },
    ],
  },
  {
    title: '4. Code of Conduct & Field Discipline',
    items: [
      { label: 'Substance Prohibition', text: 'Smoking, vaping, and possession or consumption of alcohol or illegal substances are completely prohibited across the entire premises.' },
      { label: 'On-Field Behavior', text: 'Verbal abuse, physical altercations, or coarse language will result in immediate eviction without a refund. Offending parties face a permanent ban.' },
    ],
  },
  {
    title: '5. Health, Safety & Liability Waiver',
    items: [
      { label: 'Play at Your Own Risk', text: 'All participants and spectators enter and play at their own risk. The management accepts no liability for personal injury, fractures, or medical emergencies during play.' },
      { label: 'Physical Fitness', text: 'Players are solely responsible for ensuring they are medically fit to engage in high-intensity physical activity.' },
      { label: 'Spectator Areas', text: 'Non-playing visitors must remain in the designated viewing gallery and are not permitted inside the playing perimeter during a match.' },
    ],
  },
  {
    title: '6. Weather, Storm & Rescheduling Policy',
    items: [
      { label: 'No Playing in Storms', text: 'Playing during severe storms, heavy downpours, or lightning is strictly prohibited. Management reserves the right to immediately halt play.' },
      { label: 'Remaining Time Compensation', text: 'If a match is stopped due to weather, unused time will be rescheduled for the very next day or a mutually agreed date, subject to availability.' },
      { label: 'Force Majeure', text: 'In case of power grid failure or unforeseen environmental hazard, the same next-day time credit policy applies.' },
    ],
  },
  {
    title: '7. Personal Property & Management Rights',
    items: [
      { label: 'Loss or Theft', text: 'Players are responsible for securing their personal belongings. The management accepts no liability for items lost, stolen, or damaged on the property.' },
      { label: 'Right of Admission', text: 'Management reserves an absolute right to refuse entry or evict individuals who exhibit unruly behavior or appear under the influence of any intoxicant.' },
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">T&C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Terms & Conditions</h1>
              <p className="text-sm text-gray-500">Lohagarh Turf — Facility Guidelines · Bharatpur, Rajasthan</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 italic border-l-4 border-green-500 pl-4 mb-8 leading-relaxed">
            By booking a slot or entering the facility premises, all players, teams, visitors, and spectators automatically agree to strictly abide by the rules and regulations outlined below.
          </p>

          <div className="space-y-8">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="font-bold text-green-700 text-sm uppercase tracking-wide mb-3">{section.title}</h2>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.label} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-green-600 mt-0.5 shrink-0">■</span>
                      <span><strong>{item.label}:</strong> {item.text}</span>
                    </li>
                  ))}
                </ul>
                {section.warning && (
                  <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-red-700 font-semibold text-xs mb-1">{section.warning.title}</p>
                    {section.warning.lines.map((l) => (
                      <p key={l} className="text-red-600 text-xs mt-1">{l}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-xs italic pt-6 mt-6 border-t border-gray-100">
            Thank you for your cooperation in keeping our community turf safe, clean, and professional.
          </p>

          <div className="mt-6 text-center">
            <Link href="/book"
              className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors text-sm">
              Book a Slot Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
