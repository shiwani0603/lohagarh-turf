import { NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';

const ADMIN_WA = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+917793014321').replace('+', '');

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
      whatsapp_fallback: `https://wa.me/${ADMIN_WA}?text=OTP+request+for+%2B91${cleaned}`,
      message: 'FAST2SMS_API_KEY not set in Vercel env vars',
    });
  }

  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${otp}&flash=0&numbers=${cleaned}`;
    const smsRes = await fetch(url, { method: 'GET' });
    const smsData = await smsRes.json() as { return: boolean; message?: string[]; status_code?: number };

    console.log('Fast2SMS response:', JSON.stringify(smsData));

    if (!smsData.return) {
      const reason = smsData.message?.[0] || 'Unknown Fast2SMS error';
      console.error('Fast2SMS failed:', reason, '| Status:', smsData.status_code);
      // Return whatsapp fallback so user can still get OTP
      return NextResponse.json({
        otp_token,
        error: `SMS failed: ${reason}`,
        whatsapp_fallback: `https://wa.me/${ADMIN_WA}?text=OTP+request+for+%2B91${cleaned}`,
      }, { status: 500 });
    }
  } catch (err) {
    console.error('Fast2SMS fetch error:', err);
    return NextResponse.json({
      otp_token,
      error: 'SMS service unreachable. Please try WhatsApp.',
      whatsapp_fallback: `https://wa.me/${ADMIN_WA}?text=OTP+request+for+%2B91${cleaned}`,
    }, { status: 500 });
  }

  return NextResponse.json({ otp_token, message: 'OTP sent successfully' });
}
