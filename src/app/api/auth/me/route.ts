import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createServiceClient();

  // Get or create user
  let { data: userRow } = await db
    .from('users')
    .select('*')
    .eq('firebase_uid', decoded.uid)
    .single();

  if (!userRow) {
    const { data: newUser } = await db
      .from('users')
      .insert({ firebase_uid: decoded.uid, phone: decoded.phone_number || '' })
      .select()
      .single();
    userRow = newUser;
  }

  return NextResponse.json({ user: userRow });
}

export async function PATCH(req: NextRequest) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const db = createServiceClient();

  const { data } = await db
    .from('users')
    .update({ name: body.name, email: body.email, updated_at: new Date().toISOString() })
    .eq('firebase_uid', decoded.uid)
    .select()
    .single();

  return NextResponse.json({ user: data });
}
