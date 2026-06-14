import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, signJWT } from '@/lib/jwt';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { phone, otp, otp_token } = await req.json();

  const cleaned = String(phone || '').replace(/\D/g, '').slice(-10);
  const fullPhone = `+91${cleaned}`;

  // Verify the OTP token
  const otpPayload = verifyJWT(otp_token);
  if (!otpPayload) {
    return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
  }
  if (otpPayload.phone !== fullPhone || otpPayload.otp !== String(otp)) {
    return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
  }

  // Create or find user in Supabase
  const db = createServiceClient();
  let { data: userRow } = await db
    .from('users')
    .select('*')
    .eq('firebase_uid', fullPhone)
    .single();

  if (!userRow) {
    const { data: newUser, error } = await db
      .from('users')
      .insert({ firebase_uid: fullPhone, phone: fullPhone })
      .select()
      .single();
    if (error) {
      console.error('User creation error:', error);
      return NextResponse.json({ error: 'Failed to create user account.' }, { status: 500 });
    }
    userRow = newUser;
  }

  // Issue a 30-day auth JWT
  const token = signJWT(
    { uid: fullPhone, phone: fullPhone, userId: userRow.id },
    30 * 24 * 60 * 60
  );

  return NextResponse.json({ token, user: userRow });
}
