import { NextRequest, NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/reels/auth';
import {
  ALLOWED_VIDEO_TYPES,
  MAX_REEL_DURATION_SEC,
  MAX_REELS,
  MAX_VIDEO_BYTES,
} from '@/lib/reels/constants';
import type { ReelItem } from '@/lib/reels/types';
import {
  createReelId,
  getReelsManifest,
  hasBlobStorage,
  uploadReelVideo,
  writeBlobManifest,
} from '@/lib/reels/storage';

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function parseDuration(value: FormDataEntryValue | null): number | null {
  if (typeof value !== 'string') return null;
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n <= 0 || n > MAX_REEL_DURATION_SEC) return null;
  return Math.round(n * 10) / 10;
}

export async function POST(request: NextRequest) {
  if (!hasBlobStorage()) {
    return NextResponse.json(
      {
        error:
          'Subida no disponible: configura BLOB_READ_WRITE_TOKEN en Vercel o usa videos en public/reels/.',
      },
      { status: 503 },
    );
  }

  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const formData = await request.formData();
  const video = formData.get('video');
  const title = formString(formData, 'title');
  const captionRaw = formString(formData, 'caption');
  const caption = captionRaw || undefined;
  const durationSec = parseDuration(formData.get('durationSec'));
  const replaceId = formString(formData, 'replaceId');

  if (!(video instanceof File)) {
    return NextResponse.json({ error: 'Falta el archivo de video.' }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: 'El título es obligatorio.' }, { status: 400 });
  }
  if (durationSec === null) {
    return NextResponse.json(
      { error: `Duración inválida (máximo ${MAX_REEL_DURATION_SEC} s).` },
      { status: 400 },
    );
  }
  if (!ALLOWED_VIDEO_TYPES.has(video.type)) {
    return NextResponse.json({ error: 'Formato no permitido (MP4 o WebM).' }, { status: 400 });
  }
  if (video.size > MAX_VIDEO_BYTES) {
    return NextResponse.json({ error: 'Archivo demasiado grande (máx. 40 MB).' }, { status: 400 });
  }

  const { manifest } = await getReelsManifest();
  let items = [...manifest.items];
  const id = replaceId || createReelId();

  if (replaceId) {
    const idx = items.findIndex((item) => item.id === replaceId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Reel no encontrado para reemplazar.' }, { status: 404 });
    }
  } else if (items.length >= MAX_REELS) {
    return NextResponse.json(
      { error: `Solo puedes publicar hasta ${MAX_REELS} reels.` },
      { status: 400 },
    );
  }

  const { url: videoUrl } = await uploadReelVideo(id, video);

  const reel: ReelItem = {
    id,
    title,
    caption: caption || undefined,
    videoUrl,
    durationSec,
    likeCount: replaceId ? items.find((i) => i.id === replaceId)?.likeCount ?? 0 : 0,
    createdAt: replaceId
      ? items.find((i) => i.id === replaceId)?.createdAt ?? new Date().toISOString()
      : new Date().toISOString(),
  };

  if (replaceId) {
    items = items.map((item) => (item.id === replaceId ? reel : item));
  } else {
    items.push(reel);
  }

  await writeBlobManifest({ version: 1, items });

  return NextResponse.json({ ok: true, reel });
}
