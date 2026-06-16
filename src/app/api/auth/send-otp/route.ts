import { NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  const cleaned = String(phone || '').replace(/\D/g, '').slice(-10);
  if (cleaned.length !== 10) {
    return NextResponse.json({ error: 'Enter a valid 10-digit mobile number' }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otp_token = signJWT({ phone: `+91${cleaned}`, otp }, 5 * 60);

  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    console.log(`[DEV] OTP for +91${cleaned}: ${otp}`);
    return NextResponse.json({
      otp_token,
      dev_otp: otp,
      sms_failed: true,
      error: 'FAST2SMS_API_KEY is not set in Vercel environment variables.',
    });
  }

  // Try Fast2SMS via POST (more reliable than GET)
  try {
    const smsRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
        'cache-control': 'no-cache',
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        flash: 0,
        numbers: cleaned,
      }),
    });

    let smsData: { return: boolean; message?: string | string[]; status_code?: number };
    const rawText = await smsRes.text();

    try {
      smsData = JSON.parse(rawText);
    } catch {
      console.error('Fast2SMS non-JSON response:', rawText, '| HTTP:', smsRes.status);
      return NextResponse.json({
        otp_token,
        sms_failed: true,
        error: `Fast2SMS HTTP ${smsRes.status}: ${rawText.slice(0, 200)}`,
      });
    }

    console.log('Fast2SMS response:', JSON.stringify(smsData));

    if (!smsData.return) {
      const msg = Array.isArray(smsData.message)
        ? smsData.message.join(' | ')
        : String(smsData.message || 'Unknown error');
      console.error('Fast2SMS rejected:', msg);
      return NextResponse.json({
        otp_token,
        sms_failed: true,
        error: `Fast2SMS error: ${msg}`,
      });
    }

  } catch (err) {
    console.error('Fast2SMS network error:', err);
    return NextResponse.json({
      otp_token,
      sms_failed: true,
      error: `Cannot reach Fast2SMS: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  return NextResponse.json({ otp_token, message: 'OTP sent via SMS' });
}
