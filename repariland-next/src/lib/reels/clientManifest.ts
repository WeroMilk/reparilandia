import { MAX_REEL_DURATION_SEC, MAX_REELS } from '@/lib/reels/constants';
import { buildReelsApiPayload, SEED_REELS_MANIFEST } from '@/lib/reels/seedManifest';
import type { ReelsApiResponse, ReelsManifest } from '@/lib/reels/types';

const STATIC_MANIFEST_URL = '/data/reels-manifest.json';

function isValidManifest(data: unknown): data is ReelsManifest {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as ReelsManifest).version === 1 &&
    Array.isArray((data as ReelsManifest).items)
  );
}

export function getEmbeddedReelsPayload(): ReelsApiResponse {
  return buildReelsApiPayload(SEED_REELS_MANIFEST, 'static');
}

export async function fetchStaticReelsPayload(): Promise<ReelsApiResponse | null> {
  try {
    const res = await fetch(STATIC_MANIFEST_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!isValidManifest(data) || data.items.length === 0) return null;
    return buildReelsApiPayload(data, 'static');
  } catch {
    return null;
  }
}

export async function fetchApiReelsPayload(): Promise<ReelsApiResponse | null> {
  try {
    const res = await fetch('/api/reels', { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as ReelsApiResponse;
  } catch {
    return null;
  }
}

export type LoadReelsOptions = {
  /** Tras subir/borrar en admin: priorizar manifiesto en nube vía API. */
  preferApi?: boolean;
};

export async function loadReelsForClient(options?: LoadReelsOptions): Promise<ReelsApiResponse> {
  if (options?.preferApi) {
    const api = await fetchApiReelsPayload();
    if (api?.manifest?.items?.length) return api;
  }

  const staticPayload = await fetchStaticReelsPayload();
  if (staticPayload) return staticPayload;

  return getEmbeddedReelsPayload();
}

export { MAX_REELS, MAX_REEL_DURATION_SEC };
