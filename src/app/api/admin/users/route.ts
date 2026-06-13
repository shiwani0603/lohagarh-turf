import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createServiceClient();
  const { data: adminUser } = await db.from('users').select('is_admin').eq('firebase_uid', decoded.uid).single();
  if (!adminUser?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Fetch users with aggregated booking stats in one query
  const { data: users } = await db
    .from('users')
    .select('id, phone, name, email, is_admin, is_blocked, created_at')
    .order('created_at', { ascending: false });

  if (!users) return NextResponse.json({ users: [] });

  // Fetch all confirmed bookings for aggregation
  const { data: bookings } = await db
    .from('bookings')
    .select('user_id, final_amount')
    .eq('status', 'confirmed');

  const bookingMap: Record<string, { count: number; total: number }> = {};
  (bookings || []).forEach(b => {
    if (!bookingMap[b.user_id]) bookingMap[b.user_id] = { count: 0, total: 0 };
    bookingMap[b.user_id].count++;
    bookingMap[b.user_id].total += b.final_amount || 0;
  });

  const usersWithStats = users.map(u => ({
    ...u,
    booking_count: bookingMap[u.id]?.count || 0,
    total_spent: bookingMap[u.id]?.total || 0,
  }));

  return NextResponse.json({ users: usersWithStats });
}
