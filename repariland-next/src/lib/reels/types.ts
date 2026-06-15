export type ReelItem = {
  id: string;
  title: string;
  caption?: string;
  /** Enlace externo (p. ej. video completo en Drive) */
  externalUrl?: string;
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
