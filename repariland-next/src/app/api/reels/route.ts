import { NextResponse } from 'next/server';
import { buildReelsApiPayload, getSeedReelsApiPayload } from '@/lib/reels/seedManifest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getReelsManifest } = await import('@/lib/reels/storage');
    const { manifest, storage } = await getReelsManifest();
    return NextResponse.json(buildReelsApiPayload(manifest, storage));
  } catch (err) {
    console.error('[api/reels] GET failed:', err);
    return NextResponse.json(getSeedReelsApiPayload());
  }
}
