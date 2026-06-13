import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';

async function getAdminUser(req: NextRequest, db: ReturnType<typeof createServiceClient>) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return null;
  const { data } = await db.from('users').select('is_admin').eq('firebase_uid', decoded.uid).single();
  return data?.is_admin ? data : null;
}

export async function GET(req: NextRequest) {
  const db = createServiceClient();
  const admin = await getAdminUser(req, db);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data: coupons } = await db.from('coupons').select('*').order('created_at', { ascending: false });
  return NextResponse.json({ coupons: coupons || [] });
}

export async function POST(req: NextRequest) {
  const db = createServiceClient();
  const admin = await getAdminUser(req, db);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  if (!body.code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

  const { data, error } = await db.from('coupons').insert({
    code: body.code.toUpperCase(),
    discount_type: body.discount_type,
    discount_value: body.discount_value,
    min_booking_amount: body.min_booking_amount || 0,
    max_discount: body.max_discount || null,
    max_uses: body.max_uses || null,
    valid_from: body.valid_from || null,
    valid_until: body.valid_until || null,
    is_active: body.is_active ?? true,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ coupon: data });
}
