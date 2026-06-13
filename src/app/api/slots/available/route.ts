import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 });

  const db = createServiceClient();
  const { data: bookings } = await db
    .from('bookings')
    .select('start_time, end_time')
    .eq('date', date)
    .neq('status', 'cancelled');

  const bookedSlots = (bookings || []).map(b => `${b.start_time}-${b.end_time}`);
  return NextResponse.json({ bookedSlots });
}
