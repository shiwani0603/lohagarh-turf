/* eslint-disable */
const { getApps, initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

function getAdminAuth(): { verifyIdToken: (token: string) => Promise<{ uid: string; phone_number?: string }> } {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getAuth();
}
/* eslint-enable */

export async function verifyFirebaseToken(request: Request) {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return null;
  const token = authorization.split('Bearer ')[1];
  try {
    return await getAdminAuth().verifyIdToken(token);
  } catch {
    return null;
  }
}
