import crypto from 'crypto';

const getSecret = () =>
  process.env.JWT_SECRET || 'lohagarh-turf-secret-please-set-JWT_SECRET-in-env';

function b64url(buf: Buffer): string {
  return buf.toString('base64url');
}

export function signJWT(payload: Record<string, unknown>, expiresInSeconds: number): string {
  const secret = getSecret();
  const header = b64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = b64url(Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  })));
  const sig = b64url(crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
}

export function verifyJWT(token: string): Record<string, unknown> | null {
  try {
    const secret = getSecret();
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expected = b64url(crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest());
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as Record<string, unknown>;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === 'number' && payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}
