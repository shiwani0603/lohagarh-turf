import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';

async function getAdmin(req: NextRequest, db: ReturnType<typeof createServiceClient>) {
  const d = await verifyFirebaseToken(req);
  if (!d) return null;
  const { data } = await db.from('users').select('is_admin').eq('firebase_uid', d.uid).single();
  return data?.is_admin ? data : null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const db = createServiceClient();
  if (!await getAdmin(req, db)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const { data, error } = await db.from('coupons').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ coupon: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const db = createServiceClient();
  if (!await getAdmin(req, db)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { error } = await db.from('coupons').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
