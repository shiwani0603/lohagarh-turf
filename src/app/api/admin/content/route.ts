import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });

  const db = createServiceClient();
  const { data } = await db.from('site_content').select('*').eq('key', key).single();
  return NextResponse.json(data || { key, title: '', content: '' });
}

export async function POST(req: NextRequest) {
  const decoded = await verifyFirebaseToken(req);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createServiceClient();
  const { data: userRow } = await db.from('users').select('is_admin').eq('firebase_uid', decoded.uid).single();
  if (!userRow?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { key, content, title } = await req.json();

  const { data, error } = await db
    .from('site_content')
    .upsert({ key, content, title, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
