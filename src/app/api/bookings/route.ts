import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';
import { getDayType, getSlotType, getPricePerHour } from '@/lib/pricing';
import { parseISO } from 'date-fns';

export async function GET(req: NextRequest) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createServiceClient();
  const { data: user } = await db.from('users').select('id').eq('firebase_uid', decoded.uid).single();
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { data: bookings } = await db
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  return NextResponse.json({ bookings: bookings || [] });
}

export async function POST(req: NextRequest) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createServiceClient();
  const { data: userRow } = await db.from('users').select('id, is_blocked').eq('firebase_uid', decoded.uid).single();
  if (!userRow) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (userRow.is_blocked) return NextResponse.json({ error: 'Your account is blocked' }, { status: 403 });

  const formData = await req.formData();
  const bookingsRaw = formData.get('bookings');
  const txnRef = formData.get('txnRef') as string;
  const paymentMethod = formData.get('paymentMethod') as string;
  const totalAmount = Number(formData.get('totalAmount'));
  const couponCode = formData.get('couponCode') as string;
  const discountAmount = Number(formData.get('discountAmount') || 0);
  const screenshotFile = formData.get('screenshot') as File | null;

  if (!bookingsRaw) return NextResponse.json({ error: 'No bookings provided' }, { status: 400 });

  const items = JSON.parse(bookingsRaw as string);

  // Upload screenshot to Supabase Storage
  let screenshotUrl: string | null = null;
  if (screenshotFile) {
    const bytes = await screenshotFile.arrayBuffer();
    const filename = `payment-${Date.now()}-${screenshotFile.name}`;
    const { data: uploadData } = await db.storage.from('payment-screenshots').upload(filename, bytes, {
      contentType: screenshotFile.type,
    });
    if (uploadData) {
      const { data: urlData } = db.storage.from('payment-screenshots').getPublicUrl(filename);
      screenshotUrl = urlData.publicUrl;
    }
  }

  // Check availability for each item
  for (const item of items) {
    const { data: existing } = await db
      .from('bookings')
      .select('id')
      .eq('date', item.date)
      .neq('status', 'cancelled')
      .or(`start_time.lt.${item.endTime},end_time.gt.${item.startTime}`);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: `Slot ${item.startTime} on ${item.date} is already booked` }, { status: 409 });
    }
  }

  // Create bookings
  const bookingRows = items.map((item: {
    date: string; sport: string; startTime: string; endTime: string;
    durationHours: number; slotType: string; dayType: string;
    pricePerHour: number; totalPrice: number;
  }) => ({
    user_id: userRow.id,
    date: item.date,
    sport: item.sport,
    start_time: item.startTime,
    end_time: item.endTime,
    duration_hours: item.durationHours,
    slot_type: item.slotType,
    day_type: item.dayType,
    price_per_hour: item.pricePerHour,
    total_price: item.totalPrice,
    final_amount: item.totalPrice - (discountAmount / items.length),
    status: 'pending',
    payment_method: paymentMethod,
    payment_ref: txnRef,
    payment_screenshot_url: screenshotUrl,
    coupon_code: couponCode || null,
    discount_amount: discountAmount / items.length,
  }));

  const { data, error } = await db.from('bookings').insert(bookingRows).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ bookings: data, success: true });
}
