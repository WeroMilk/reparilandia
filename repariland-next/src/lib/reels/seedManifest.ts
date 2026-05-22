import { MAX_REEL_DURATION_SEC, MAX_REELS } from '@/lib/reels/constants';
import type { ReelsApiResponse, ReelsManifest, ReelsStorageKind } from '@/lib/reels/types';

/** Reel de muestra (public/reels/reel-mpdei80m-8d05d.mp4) — siempre disponible en deploy. */
export const SEED_REELS_MANIFEST: ReelsManifest = {
  version: 1,
  items: [
    {
      id: 'reel-screen-0522-2026',
      title: 'Reparilandia',
      caption: 'Así se vive la experiencia en Reparilandia',
      videoUrl: '/reels/reel-screen-0522-2026.mp4',
      durationSec: 30,
      likeCount: 0,
      createdAt: '2026-05-22T18:34:26.000Z',
    },
    {
      id: 'reel-mpdei80m-8d05d',
      title: 'Reparilandia',
      caption: 'Nuestro primer reel',
      videoUrl: '/reels/reel-mpdei80m-8d05d.mp4',
      durationSec: 30,
      likeCount: 0,
      createdAt: '2026-05-20T01:46:33.669Z',
    },
  ],
};

export function buildReelsApiPayload(
  manifest: ReelsManifest,
  storage: ReelsStorageKind,
): ReelsApiResponse {
  return {
    manifest,
    storage,
    maxReels: MAX_REELS,
    maxDurationSec: MAX_REEL_DURATION_SEC,
  };
}

export function getSeedReelsApiPayload(): ReelsApiResponse {
  return buildReelsApiPayload(SEED_REELS_MANIFEST, 'static');
}
