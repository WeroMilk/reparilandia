import { REELS_LIKED_STORAGE_KEY } from '@/lib/reels/constants';

function readLikedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(REELS_LIKED_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === 'string'));
  } catch {
    return new Set();
  }
}

export function hasLikedReel(id: string): boolean {
  return readLikedIds().has(id);
}

export function markReelLiked(id: string): void {
  if (typeof window === 'undefined') return;
  const ids = readLikedIds();
  ids.add(id);
  localStorage.setItem(REELS_LIKED_STORAGE_KEY, JSON.stringify([...ids]));
}

export function getLikedReelIds(): string[] {
  return [...readLikedIds()];
}
