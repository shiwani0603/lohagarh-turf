'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

type Review = { id:string; name:string; rating:number; text:string; date:string; status:'pending'|'approved'|'rejected' };

const INIT: Review[] = [
  { id:'1', name:'Rahul Sharma',  rating:5, text:'Best turf in Bharatpur! Excellent facility and very easy to book online.',      date:'2026-06-01', status:'approved' },
  { id:'2', name:'Priya Singh',   rating:5, text:'Loved the experience. Turf is well-maintained and lighting is perfect.',         date:'2026-06-02', status:'approved' },
  { id:'3', name:'Amit Verma',    rating:4, text:'Great facility beside Keoladeo Park. Booking was super easy.',                  date:'2026-06-03', status:'approved' },
  { id:'4', name:'Suresh Kumar',  rating:5, text:'Used for corporate event. Staff was helpful and ground was in top condition.',   date:'2026-06-04', status:'approved' },
  { id:'5', name:'Neha Agarwal',  rating:5, text:'Perfect for cricket and football. Will definitely book again!',                  date:'2026-06-05', status:'approved' },
  { id:'6', name:'Vikram Joshi',  rating:4, text:'Good floodlights and clean changing rooms.',                                     date:'2026-06-05', status:'approved' },
  { id:'7', name:'Kiran Patel',   rating:3, text:'Average experience. Parking was a bit difficult to find.',                       date:'2026-06-06', status:'pending'  },
  { id:'8', name:'Deepak Gupta',  rating:5, text:'Absolutely loved it! Best sports facility in the region.',                      date:'2026-06-06', status:'pending'  },
];

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-600',
};

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i<=n?'text-yellow-400':'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>(INIT);
  const [filter,  setFilter]  = useState('all');

  const setStatus = (id: string, status: Review['status']) => {
    setReviews(p => p.map(r => r.id===id ? {...r, status} : r));
    toast.success(`Review ${status}`);
  };

  const deleteReview = (id: string) => { setReviews(p => p.filter(r => r.id!==id)); toast.success('Review deleted'); };

  const filtered = filter==='all' ? reviews : reviews.filter(r => r.status===filter);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {reviews.filter(r=>r.status==='pending').length} pending · {reviews.filter(r=>r.status==='approved').length} approved
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['all','pending','approved','rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              filter===s ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'
            }`}>
            {s} {s!=='all' && `(${reviews.filter(r=>r.status===s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                  {r.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{r.name}</span>
                    <Stars n={r.rating} />
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]}`}>
                      {r.status}
                    </span>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                </div>
              </div>

              <div className="flex gap-1.5 flex-shrink-0">
                {r.status !== 'approved' && (
                  <button onClick={() => setStatus(r.id, 'approved')}
                    className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium transition-colors">
                    Approve
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button onClick={() => setStatus(r.id, 'rejected')}
                    className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors">
                    Reject
                  </button>
                )}
                <button onClick={() => deleteReview(r.id)}
                  className="text-xs px-2 py-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">🗑</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No reviews in this category</div>
        )}
      </div>
    </div>
  );
}
