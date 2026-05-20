export type ReelItem = {
  id: string;
  title: string;
  caption?: string;
  videoUrl: string;
  posterUrl?: string;
  durationSec: number;
  likeCount: number;
  createdAt: string;
};

export type ReelsManifest = {
  version: 1;
  items: ReelItem[];
};

export type ReelsStorageKind = 'supabase' | 'blob' | 'static';

export type ReelsApiResponse = {
  manifest: ReelsManifest;
  storage: ReelsStorageKind;
  maxReels: number;
  maxDurationSec: number;
};
