import 'server-only';

import { readFile } from 'fs/promises';
import path from 'path';
import { createSupabaseAdmin, hasSupabaseConfig } from '@/lib/supabase/server';
import type { ReelItem, ReelsManifest, ReelsStorageKind } from '@/lib/reels/types';
import {
  BLOB_MANIFEST_PATH,
  MAX_REELS,
  SUPABASE_MANIFEST_PATH,
  SUPABASE_REELS_BUCKET,
} from '@/lib/reels/constants';
import { SEED_REELS_MANIFEST } from '@/lib/reels/seedManifest';

const EMPTY_MANIFEST: ReelsManifest = { version: 1, items: [] };

function staticManifestPaths(): string[] {
  const cwd = process.cwd();
  return [
    path.join(cwd, 'public', 'data', 'reels-manifest.json'),
    path.join(cwd, 'repariland-next', 'public', 'data', 'reels-manifest.json'),
  ];
}

export function hasSupabaseStorage(): boolean {
  return hasSupabaseConfig();
}

export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function hasWritableStorage(): boolean {
  return hasSupabaseStorage() || hasBlobStorage();
}

export function getWritableBackend(): 'supabase' | 'blob' | null {
  if (hasSupabaseStorage()) return 'supabase';
  if (hasBlobStorage()) return 'blob';
  return null;
}

function normalizeManifest(data: unknown): ReelsManifest {
  if (
    typeof data === 'object' &&
    data !== null &&
    'version' in data &&
    (data as ReelsManifest).version === 1 &&
    Array.isArray((data as ReelsManifest).items)
  ) {
    const items = (data as ReelsManifest).items
      .slice(0, MAX_REELS)
      .filter(
        (item): item is ReelItem =>
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.videoUrl === 'string' &&
          typeof item.durationSec === 'number' &&
          typeof item.likeCount === 'number' &&
          typeof item.createdAt === 'string',
      );
    return { version: 1, items };
  }
  return EMPTY_MANIFEST;
}

function withSeedFallback(manifest: ReelsManifest): ReelsManifest {
  if (manifest.items.length > 0) return manifest;
  return SEED_REELS_MANIFEST;
}

export async function readStaticManifest(): Promise<ReelsManifest> {
  for (const filePath of staticManifestPaths()) {
    try {
      const raw = await readFile(filePath, 'utf8');
      const parsed = normalizeManifest(JSON.parse(raw));
      if (parsed.items.length > 0) return parsed;
    } catch {
      // Siguiente ruta (monorepo Vercel vs local)
    }
  }
  return SEED_REELS_MANIFEST;
}

export async function readSupabaseManifest(): Promise<ReelsManifest | null> {
  if (!hasSupabaseStorage()) return null;
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(SUPABASE_REELS_BUCKET)
      .download(SUPABASE_MANIFEST_PATH);
    if (error || !data) return null;
    const raw = await data.text();
    return normalizeManifest(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function readBlobManifest(): Promise<ReelsManifest | null> {
  if (!hasBlobStorage()) return null;
  try {
    const { head } = await import('@vercel/blob');
    const meta = await head(BLOB_MANIFEST_PATH);
    const response = await fetch(meta.url, { cache: 'no-store' });
    if (!response.ok) return null;
    return normalizeManifest(await response.json());
  } catch {
    return null;
  }
}

export async function getReelsManifest(): Promise<{
  manifest: ReelsManifest;
  storage: ReelsStorageKind;
}> {
  try {
    const staticManifest = await readStaticManifest();

    if (hasSupabaseStorage()) {
      const supabaseManifest = await readSupabaseManifest();
      if (supabaseManifest && supabaseManifest.items.length > 0) {
        return { manifest: supabaseManifest, storage: 'supabase' };
      }
    }

    const blobManifest = await readBlobManifest();
    if (blobManifest !== null && blobManifest.items.length > 0) {
      return { manifest: blobManifest, storage: 'blob' };
    }

    return { manifest: withSeedFallback(staticManifest), storage: 'static' };
  } catch {
    return { manifest: SEED_REELS_MANIFEST, storage: 'static' };
  }
}

export async function writeManifest(
  manifest: ReelsManifest,
  storage: Exclude<ReelsStorageKind, 'static'>,
): Promise<void> {
  if (storage === 'supabase') {
    await writeSupabaseManifest(manifest);
    return;
  }
  await writeBlobManifest(manifest);
}

export async function writeSupabaseManifest(manifest: ReelsManifest): Promise<void> {
  if (!hasSupabaseStorage()) {
    throw new Error('Supabase no configurado');
  }
  const supabase = createSupabaseAdmin();
  const body = Buffer.from(JSON.stringify(manifest, null, 2), 'utf8');
  const { error } = await supabase.storage.from(SUPABASE_REELS_BUCKET).upload(SUPABASE_MANIFEST_PATH, body, {
    upsert: true,
    contentType: 'application/json',
  });
  if (error) throw new Error(error.message);
}

export async function writeBlobManifest(manifest: ReelsManifest): Promise<void> {
  if (!hasBlobStorage()) {
    throw new Error('BLOB_READ_WRITE_TOKEN no configurado');
  }
  const { put } = await import('@vercel/blob');
  await put(BLOB_MANIFEST_PATH, JSON.stringify(manifest, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export async function uploadReelVideo(
  id: string,
  file: File,
  backend: 'supabase' | 'blob',
): Promise<{ url: string }> {
  const ext = file.type === 'video/webm' ? 'webm' : 'mp4';

  if (backend === 'supabase') {
    if (!hasSupabaseStorage()) {
      throw new Error('Supabase no configurado');
    }
    const supabase = createSupabaseAdmin();
    const objectPath = `videos/${id}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage.from(SUPABASE_REELS_BUCKET).upload(objectPath, buffer, {
      upsert: true,
      contentType: file.type,
    });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(SUPABASE_REELS_BUCKET).getPublicUrl(objectPath);
    return { url: data.publicUrl };
  }

  if (!hasBlobStorage()) {
    throw new Error('BLOB_READ_WRITE_TOKEN no configurado');
  }
  const { put } = await import('@vercel/blob');
  const blob = await put(`reels/${id}.${ext}`, file, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: file.type,
  });
  return { url: blob.url };
}

export async function deleteReelVideo(id: string, videoUrl: string, storage: ReelsStorageKind): Promise<void> {
  if (storage === 'supabase' && hasSupabaseStorage()) {
    const supabase = createSupabaseAdmin();
    const marker = `/object/public/${SUPABASE_REELS_BUCKET}/`;
    const idx = videoUrl.indexOf(marker);
    const objectPath = idx >= 0 ? decodeURIComponent(videoUrl.slice(idx + marker.length)) : `videos/${id}.mp4`;
    await supabase.storage.from(SUPABASE_REELS_BUCKET).remove([objectPath]);
    return;
  }
  if (storage === 'blob' && hasBlobStorage()) {
    try {
      const { del } = await import('@vercel/blob');
      await del(videoUrl);
    } catch {
      // El manifiesto ya no referencia el video; fallo de borrado no es crítico
    }
  }
}

export function createReelId(): string {
  return `reel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
