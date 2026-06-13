import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { code, amount } = await req.json();
  if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });

  const db = createServiceClient();
  const { data: coupon } = await db
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (!coupon) return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });

  // Check validity dates
  const now = new Date().toISOString().split('T')[0];
  if (coupon.valid_from && now < coupon.valid_from) return NextResponse.json({ error: 'Coupon not yet valid' }, { status: 400 });
  if (coupon.valid_until && now > coupon.valid_until) return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });

  // Check usage limit
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
  }

  // Check minimum amount
  if (coupon.min_booking_amount && amount < coupon.min_booking_amount) {
    return NextResponse.json({ error: `Minimum booking amount ₹${coupon.min_booking_amount} required` }, { status: 400 });
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = Math.round(amount * (coupon.discount_value / 100));
    if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
  } else {
    discount = coupon.discount_value;
  }

  return NextResponse.json({ discount, coupon: { code: coupon.code, type: coupon.discount_type, value: coupon.discount_value } });
}
