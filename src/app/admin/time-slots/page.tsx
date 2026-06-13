'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

type Slot = { id: string; time: string; price: number; available: boolean; bookedManually: boolean };

const INIT_SLOTS: Slot[] = [
  { id:'1', time:'6:00 AM – 7:00 AM',   price:500, available:true,  bookedManually:false },
  { id:'2', time:'7:00 AM – 8:00 AM',   price:500, available:false, bookedManually:true  },
  { id:'3', time:'8:00 AM – 9:00 AM',   price:500, available:true,  bookedManually:false },
  { id:'4', time:'5:00 PM – 6:00 PM',   price:500, available:true,  bookedManually:false },
  { id:'5', time:'6:00 PM – 7:00 PM',   price:500, available:false, bookedManually:true  },
  { id:'6', time:'7:00 PM – 8:00 PM',   price:500, available:true,  bookedManually:false },
  { id:'7', time:'8:00 PM – 9:00 PM',   price:500, available:true,  bookedManually:false },
  { id:'8', time:'9:00 PM – 10:00 PM',  price:500, available:true,  bookedManually:false },
];

export default function AdminTimeSlots() {
  const [slots,      setSlots]      = useState<Slot[]>(INIT_SLOTS);
  const [globalPrice,setGlobalPrice]= useState(500);
  const [newSlot,    setNewSlot]    = useState({ start:'', end:'', price:'500' });
  const [editId,     setEditId]     = useState<string|null>(null);
  const [editPrice,  setEditPrice]  = useState('');

  const toggleAvailable = (id: string) =>
    setSlots(prev => prev.map(s => s.id===id ? {...s, available:!s.available, bookedManually:!s.available?false:s.bookedManually} : s));

  const toggleManualBook = (id: string) =>
    setSlots(prev => prev.map(s => s.id===id ? {...s, bookedManually:!s.bookedManually, available:s.bookedManually?true:false} : s));

  const deleteSlot = (id: string) => setSlots(prev => prev.filter(s => s.id!==id));

  const addSlot = () => {
    if (!newSlot.start || !newSlot.end) { toast.error('Enter start and end time'); return; }
    const id = Date.now().toString();
    setSlots(prev => [...prev, { id, time:`${newSlot.start} – ${newSlot.end}`, price:Number(newSlot.price)||500, available:true, bookedManually:false }]);
    setNewSlot({ start:'', end:'', price:'500' });
    toast.success('Slot added');
  };

  const applyGlobalPrice = () => {
    setSlots(prev => prev.map(s => ({...s, price:globalPrice})));
    toast.success(`Price updated to ₹${globalPrice} for all slots`);
  };

  const saveSlotPrice = (id: string) => {
    setSlots(prev => prev.map(s => s.id===id ? {...s, price:Number(editPrice)} : s));
    setEditId(null);
    toast.success('Price updated');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Time Slots & Pricing</h2>
        <p className="text-gray-500 text-sm mt-0.5">Manage available time slots and per-slot pricing.</p>
      </div>

      {/* Global price */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Set Global Price (all slots)</h3>
        <div className="flex gap-3 items-center">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">₹</span>
            <input type="number" value={globalPrice} onChange={e => setGlobalPrice(Number(e.target.value))}
              className="px-3 py-2.5 text-sm w-28 outline-none" />
          </div>
          <button onClick={applyGlobalPrice}
            className="bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors">
            Apply to All Slots
          </button>
        </div>
      </div>

      {/* Slots list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">Current Slots</h3>
          <span className="text-xs text-gray-400">{slots.filter(s=>s.available).length} available · {slots.filter(s=>!s.available).length} blocked</span>
        </div>
        <div className="divide-y divide-gray-50">
          {slots.map(s => (
            <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{s.time}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {s.available
                    ? <span className="text-xs text-green-600 font-medium">● Available</span>
                    : s.bookedManually
                      ? <span className="text-xs text-orange-500 font-medium">● Blocked (Admin)</span>
                      : <span className="text-xs text-red-500 font-medium">● Booked</span>
                  }
                </div>
              </div>

              {/* Price */}
              <div className="w-28">
                {editId === s.id ? (
                  <div className="flex gap-1">
                    <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                      className="w-16 px-2 py-1 border border-green-400 rounded text-xs outline-none" />
                    <button onClick={() => saveSlotPrice(s.id)} className="text-xs text-green-600 font-semibold">Save</button>
                  </div>
                ) : (
                  <button onClick={() => { setEditId(s.id); setEditPrice(String(s.price)); }}
                    className="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors">
                    ₹{s.price} <span className="text-xs text-gray-400">✏️</span>
                  </button>
                )}
              </div>

              {/* Toggle available */}
              <button onClick={() => toggleAvailable(s.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  s.available
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}>
                {s.available ? 'Disable' : 'Enable'}
              </button>

              {/* Manual book */}
              <button onClick={() => toggleManualBook(s.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  s.bookedManually
                    ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                }`}>
                {s.bookedManually ? 'Unblock' : 'Block'}
              </button>

              {/* Delete */}
              <button onClick={() => deleteSlot(s.id)}
                className="text-xs px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add new slot */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4 text-sm">Add New Slot</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start Time</label>
            <input type="text" placeholder="e.g. 10:00 AM" value={newSlot.start}
              onChange={e => setNewSlot(p => ({...p, start:e.target.value}))}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm w-36 outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End Time</label>
            <input type="text" placeholder="e.g. 11:00 AM" value={newSlot.end}
              onChange={e => setNewSlot(p => ({...p, end:e.target.value}))}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm w-36 outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Price (₹)</label>
            <input type="number" value={newSlot.price}
              onChange={e => setNewSlot(p => ({...p, price:e.target.value}))}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm w-24 outline-none focus:border-green-400" />
          </div>
          <button onClick={addSlot}
            className="bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors">
            Add Slot
          </button>
        </div>
      </div>
    </div>
  );
}
