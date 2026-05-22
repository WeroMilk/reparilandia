import { NextResponse } from 'next/server';
import { buildReelsApiPayload, getSeedReelsApiPayload } from '@/lib/reels/seedManifest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Siempre 200: evita 500 en consola del navegador y mantiene el feed con seed/estático. */
export async function GET() {
  let payload = getSeedReelsApiPayload();

  try {
    const { getReelsManifest } = await import('@/lib/reels/storage');
    const { manifest, storage } = await getReelsManifest();
    payload = buildReelsApiPayload(manifest, storage);
  } catch {
    // Manifiesto embebido / estático
  }

  return NextResponse.json(payload, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  });
}
