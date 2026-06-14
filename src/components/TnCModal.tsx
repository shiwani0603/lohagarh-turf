'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface TnCModalProps {
  onClose: () => void;
}

export default function TnCModal({ onClose }: TnCModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">T&C</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Terms & Conditions</h2>
              <p className="text-xs text-gray-500">Lohagarh Turf — Facility Guidelines</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 text-sm text-gray-700 space-y-6">
          <p className="text-gray-500 italic border-l-4 border-green-500 pl-4 text-xs leading-relaxed">
            By booking a slot or entering the facility premises, all players, teams, visitors, and spectators automatically agree to strictly abide by the rules and regulations outlined below.
          </p>

          {/* Section 1 */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3 text-green-700">1. Booking, Payments & Cancellations</h3>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Slot Duration:</strong> The booking slot is strictly for the time reserved. Teams must vacate the turf immediately when their time ends so that subsequent sessions can commence on schedule.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Advance Payment:</strong> A booking is officially confirmed only upon receipt of the designated advance or full payment, as specified during the reservation system check-out.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Cancellation & Rescheduling:</strong> Requests to cancel or reschedule must be communicated at least 24 to 48 hours prior to the slot. Failure to do so will result in the forfeiture of the booking amount or deposit.</span></li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3 text-green-700">2. Footwear & Approved Gear Regulations</h3>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Approved Footwear:</strong> Only flat-soled sports shoes, indoor trainers, or specialized turf shoes (multi-studs) are permitted. Metal spikes, molds, or hard plastic studs are <strong>strictly banned</strong> as they permanently tear the artificial fibers.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Cricket Bats & Balls:</strong> Only standard tennis-cricket bats or indoor bats are permitted. Hard leather cricket balls are strictly prohibited.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Appropriate Attire:</strong> Players must be dressed in appropriate sportswear. Heavy jewelry, watches, or metal belt buckles must be removed prior to play.</span></li>
            </ul>
            <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-red-700 font-semibold text-xs mb-1">⚠️ STRICTLY ENFORCED: ZERO TOLERANCE</p>
              <p className="text-red-600 text-xs"><strong>No Spitting</strong> anywhere on the turf surface.</p>
              <p className="text-red-600 text-xs mt-1"><strong>No Food or Colored Drinks</strong> — only pure drinking water is allowed inside the cage.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3 text-green-700">3. Property Damage & Equipment Liability</h3>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Damage to Turf:</strong> Any deliberate, negligent, or malicious damage to the artificial grass matting is heavily penalized.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Asset Abuse:</strong> Hitting, kicking, or hanging onto perimeter netting, roof nets, goalposts, or floodlighting poles is strictly forbidden.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Financial Liability:</strong> The individual booking the slot or the team captain will be held <strong>completely responsible</strong> for the full replacement or repair cost of any damaged facility asset.</span></li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3 text-green-700">4. Code of Conduct & Field Discipline</h3>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Substance Prohibition:</strong> Smoking, vaping, and possession or consumption of alcohol or illegal substances are completely prohibited across the entire premises.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>On-Field Behavior:</strong> Verbal abuse, physical altercations, or coarse language will result in immediate eviction without a refund. Offending parties face a permanent ban.</span></li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3 text-green-700">5. Health, Safety & Liability Waiver</h3>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Play at Your Own Risk:</strong> All participants and spectators enter and play at their own risk. The management accepts no liability for personal injury, fractures, or medical emergencies during play.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Physical Fitness:</strong> Players are solely responsible for ensuring they are medically fit to engage in high-intensity physical activity.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Spectator Areas:</strong> Non-playing visitors must remain in the designated viewing gallery and are not permitted inside the playing perimeter during a match.</span></li>
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3 text-green-700">6. Weather, Storm & Rescheduling Policy</h3>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>No Playing in Storms:</strong> Playing during severe storms, heavy downpours, or lightning is strictly prohibited. Management reserves the right to immediately halt play.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Remaining Time Compensation:</strong> If a match is stopped due to weather, unused time will be rescheduled for the very next day or a mutually agreed date, subject to availability.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Force Majeure:</strong> In case of power grid failure or unforeseen environmental hazard, the same next-day time credit policy applies.</span></li>
            </ul>
          </div>

          {/* Section 7 */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3 text-green-700">7. Personal Property & Management Rights</h3>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Loss or Theft:</strong> Players are responsible for securing their personal belongings. The management accepts no liability for items lost, stolen, or damaged on the property.</span></li>
              <li className="flex gap-2"><span className="text-green-600 mt-0.5 shrink-0">■</span><span><strong>Right of Admission:</strong> Management reserves an absolute right to refuse entry or evict individuals who exhibit unruly behavior or appear under the influence of any intoxicant.</span></li>
            </ul>
          </div>

          <p className="text-center text-gray-400 text-xs italic pt-2 border-t border-gray-100">
            Thank you for your cooperation in keeping our community turf safe, clean, and professional.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button onClick={onClose}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors text-sm">
            I have read and understood the Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  );
}
