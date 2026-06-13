import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createServiceClient();
  const { data: user } = await db.from('users').select('id').eq('firebase_uid', decoded.uid).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { data: booking } = await db
    .from('bookings').select('*').eq('id', params.id).eq('user_id', user.id).single();

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  if (booking.status === 'cancelled') return NextResponse.json({ error: 'Already cancelled' }, { status: 400 });

  // Check cancellation time (must be 2 hours before)
  const now = new Date();
  const slotDate = new Date(`${booking.date}T${booking.start_time}`);
  const hoursUntilSlot = (slotDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursUntilSlot < 2) {
    return NextResponse.json({ error: 'Cannot cancel less than 2 hours before the slot' }, { status: 400 });
  }

  await db.from('bookings').update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', params.id);

  return NextResponse.json({ success: true });
}
