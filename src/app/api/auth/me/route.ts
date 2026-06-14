import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createServiceClient();
  const phone = decoded.phone_number || decoded.uid;

  let { data: userRow } = await db
    .from('users')
    .select('*')
    .eq('firebase_uid', phone)
    .single();

  if (!userRow) {
    const { data: newUser } = await db
      .from('users')
      .insert({ firebase_uid: phone, phone })
      .select()
      .single();
    userRow = newUser;
  }

  return NextResponse.json({ user: userRow });
}

export async function PATCH(req: NextRequest) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const phone = decoded.phone_number || decoded.uid;
  const body = await req.json();
  const db = createServiceClient();

  const { data } = await db
    .from('users')
    .update({ name: body.name, email: body.email, updated_at: new Date().toISOString() })
    .eq('firebase_uid', phone)
    .select()
    .single();

  return NextResponse.json({ user: data });
}
