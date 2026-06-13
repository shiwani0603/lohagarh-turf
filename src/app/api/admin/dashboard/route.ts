import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createServiceClient();
  const { data: userRow } = await db.from('users').select('is_admin').eq('firebase_uid', decoded.uid).single();
  if (!userRow?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const today = new Date().toISOString().split('T')[0];

  const [allBookings, todayBookings, users] = await Promise.all([
    db.from('bookings').select('status, final_amount'),
    db.from('bookings').select('id, status').eq('date', today),
    db.from('users').select('id', { count: 'exact' }),
  ]);

  const bookings = allBookings.data || [];
  const stats = {
    totalBookings: bookings.length,
    todayBookings: todayBookings.data?.length || 0,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + (b.final_amount || 0), 0),
    totalUsers: users.count || 0,
  };

  return NextResponse.json(stats);
}
