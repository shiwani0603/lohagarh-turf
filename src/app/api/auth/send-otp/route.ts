import { NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  const cleaned = String(phone || '').replace(/\D/g, '').slice(-10);
  if (cleaned.length !== 10) {
    return NextResponse.json({ error: 'Enter a valid 10-digit mobile number' }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Sign OTP in a short-lived token (stateless — no DB needed)
  const otp_token = signJWT({ phone: `+91${cleaned}`, otp }, 5 * 60); // 5 min

  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    // Development mode: return OTP directly (safe only in dev)
    console.log(`[DEV] OTP for +91${cleaned}: ${otp}`);
    return NextResponse.json({
      otp_token,
      dev_otp: otp,
      message: 'OTP generated (FAST2SMS_API_KEY not set — showing OTP for dev)',
    });
  }

  // Send OTP via Fast2SMS
  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${otp}&flash=0&numbers=${cleaned}`;
    const smsRes = await fetch(url, { method: 'GET' });
    const smsData = await smsRes.json() as { return: boolean; message?: string[] };

    if (!smsData.return) {
      console.error('Fast2SMS error:', smsData);
      return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
    }
  } catch (err) {
    console.error('Fast2SMS fetch error:', err);
    return NextResponse.json({ error: 'Failed to send OTP. Check your connection.' }, { status: 500 });
  }

  return NextResponse.json({ otp_token, message: 'OTP sent successfully' });
}
