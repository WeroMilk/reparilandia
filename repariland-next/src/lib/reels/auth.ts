import { cookies } from 'next/headers';

export const REELS_ADMIN_COOKIE = 'reels_admin_session';

export function getUploadSecret(): string | undefined {
  return process.env.REELS_UPLOAD_SECRET?.trim() || undefined;
}

export function isValidUploadSecret(secret: string): boolean {
  const expected = getUploadSecret();
  if (!expected) return false;
  return secret === expected;
}

export async function isAdminSession(): Promise<boolean> {
  const expected = getUploadSecret();
  if (!expected) return false;
  const cookieStore = await cookies();
  const session = cookieStore.get(REELS_ADMIN_COOKIE)?.value;
  return session === expected;
}

export function adminCookieOptions(maxAgeSec = 60 * 60 * 8) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSec,
  };
}
