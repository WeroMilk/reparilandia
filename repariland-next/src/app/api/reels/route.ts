import { NextResponse } from 'next/server';
import { MAX_REEL_DURATION_SEC, MAX_REELS } from '@/lib/reels/constants';
import { getReelsManifest } from '@/lib/reels/storage';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { manifest, storage } = await getReelsManifest();
    return NextResponse.json({
      manifest,
      storage,
      maxReels: MAX_REELS,
      maxDurationSec: MAX_REEL_DURATION_SEC,
    });
  } catch (error) {
    console.error('[GET /api/reels]', error);
    return NextResponse.json(
      {
        manifest: { version: 1, items: [] },
        storage: 'static',
        maxReels: MAX_REELS,
        maxDurationSec: MAX_REEL_DURATION_SEC,
      },
      { status: 200 },
    );
  }
}
