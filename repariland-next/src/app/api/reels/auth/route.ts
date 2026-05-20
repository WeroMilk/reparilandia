import { NextRequest, NextResponse } from 'next/server';
import { adminCookieOptions, getUploadSecret, isValidUploadSecret, REELS_ADMIN_COOKIE } from '@/lib/reels/auth';

export async function POST(request: NextRequest) {
  const secret = getUploadSecret();
  if (!secret) {
    return NextResponse.json(
      { error: 'REELS_UPLOAD_SECRET no está configurado en el servidor.' },
      { status: 503 },
    );
  }

  let body: { secret?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo JSON inválido.' }, { status: 400 });
  }

  const provided = typeof body.secret === 'string' ? body.secret.trim() : '';
  if (!isValidUploadSecret(provided)) {
    return NextResponse.json({ error: 'Clave incorrecta.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(REELS_ADMIN_COOKIE, secret, adminCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(REELS_ADMIN_COOKIE, '', { ...adminCookieOptions(0), maxAge: 0 });
  return response;
}
