import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';
import { getDayType, getSlotType, getPricePerHour } from '@/lib/pricing';

async function isAdmin(req: NextRequest, db: ReturnType<typeof createServiceClient>) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return null;
  const { data } = await db.from('users').select('id, is_admin').eq('firebase_uid', decoded.uid).single();
  return data?.is_admin ? data : null;
}

export async function GET(req: NextRequest) {
  const db = createServiceClient();
  const admin = await isAdmin(req, db);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data: bookings } = await db
    .from('bookings')
    .select('*, users(name, phone)')
    .order('date', { ascending: false })
    .order('start_time', { ascending: true });

  return NextResponse.json({ bookings: bookings || [] });
}

export async function POST(req: NextRequest) {
  const db = createServiceClient();
  const admin = await isAdmin(req, db);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { date, start_time, end_time, note } = await req.json();

  // Check availability
  const { data: existing } = await db
    .from('bookings')
    .select('id')
    .eq('date', date)
    .neq('status', 'cancelled')
    .or(`start_time.lt.${end_time},end_time.gt.${start_time}`);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'Slot already booked for this time range' }, { status: 409 });
  }

  const dateObj = new Date(date);
  const dayType = getDayType(dateObj);
  const slotType = getSlotType(start_time);
  const pricePerHour = getPricePerHour(slotType, dayType);
  const [sh, em] = [parseInt(start_time.split(':')[0]), parseInt(end_time.split(':')[0])];
  const duration = em - sh;

  const { data, error } = await db.from('bookings').insert({
    user_id: admin.id,
    date,
    start_time,
    end_time,
    duration_hours: duration,
    sport: note || 'Admin Blocked',
    slot_type: slotType,
    day_type: dayType,
    price_per_hour: pricePerHour,
    total_price: pricePerHour * duration,
    final_amount: pricePerHour * duration,
    status: 'confirmed',
    booked_by_admin: true,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking: data });
}
