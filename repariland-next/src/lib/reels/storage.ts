import 'server-only';

import { readFile } from 'fs/promises';
import path from 'path';
import { head, put } from '@vercel/blob';
import type { ReelItem, ReelsManifest } from '@/lib/reels/types';
import { BLOB_MANIFEST_PATH, MAX_REELS } from '@/lib/reels/constants';

const EMPTY_MANIFEST: ReelsManifest = { version: 1, items: [] };

export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
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

export async function readStaticManifest(): Promise<ReelsManifest> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'reels-manifest.json');
  try {
    const raw = await readFile(filePath, 'utf8');
    return normalizeManifest(JSON.parse(raw));
  } catch {
    return EMPTY_MANIFEST;
  }
}

export async function readBlobManifest(): Promise<ReelsManifest | null> {
  if (!hasBlobStorage()) return null;
  try {
    const meta = await head(BLOB_MANIFEST_PATH);
    const response = await fetch(meta.url, { cache: 'no-store' });
    if (!response.ok) return null;
    return normalizeManifest(await response.json());
  } catch {
    // Token inválido o Blob sin manifiesto → usar public/data estático
    return null;
  }
}

export async function getReelsManifest(): Promise<{
  manifest: ReelsManifest;
  storage: 'blob' | 'static';
}> {
  const blobManifest = await readBlobManifest();
  if (blobManifest !== null) {
    return { manifest: blobManifest, storage: 'blob' };
  }
  const staticManifest = await readStaticManifest();
  return { manifest: staticManifest, storage: 'static' };
}

export async function writeBlobManifest(manifest: ReelsManifest): Promise<void> {
  if (!hasBlobStorage()) {
    throw new Error('BLOB_READ_WRITE_TOKEN no configurado');
  }
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
): Promise<{ url: string }> {
  if (!hasBlobStorage()) {
    throw new Error('BLOB_READ_WRITE_TOKEN no configurado');
  }
  const ext = file.type === 'video/webm' ? 'webm' : 'mp4';
  const blob = await put(`reels/${id}.${ext}`, file, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: file.type,
  });
  return { url: blob.url };
}

export function createReelId(): string {
  return `reel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
