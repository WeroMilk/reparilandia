import { NextRequest, NextResponse } from 'next/server';
import { getReelsManifest, hasBlobStorage, writeBlobManifest } from '@/lib/reels/storage';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const { manifest, storage } = await getReelsManifest();
  const index = manifest.items.findIndex((item) => item.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Reel no encontrado.' }, { status: 404 });
  }

  const items = [...manifest.items];
  const current = items[index];
  const likeCount = current.likeCount + 1;
  items[index] = { ...current, likeCount };

  if (storage === 'blob' && hasBlobStorage()) {
    await writeBlobManifest({ version: 1, items });
  }

  return NextResponse.json({ ok: true, id, likeCount });
}
