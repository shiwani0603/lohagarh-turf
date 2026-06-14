import { verifyJWT } from '@/lib/jwt';

export async function verifyFirebaseToken(
  request: Request
): Promise<{ uid: string; phone_number?: string } | null> {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return null;
  const token = authorization.split('Bearer ')[1];

  const payload = verifyJWT(token);
  if (!payload) return null;

  const phone = payload.phone as string;
  return { uid: phone, phone_number: phone };
}
