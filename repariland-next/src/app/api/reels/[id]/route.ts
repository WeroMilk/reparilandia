import { NextRequest, NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/reels/auth';
import { getReelsManifest, hasBlobStorage, writeBlobManifest } from '@/lib/reels/storage';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!hasBlobStorage()) {
    return NextResponse.json({ error: 'Eliminación no disponible sin Blob.' }, { status: 503 });
  }

  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { id } = await context.params;
  const { manifest } = await getReelsManifest();
  const items = manifest.items.filter((item) => item.id !== id);

  if (items.length === manifest.items.length) {
    return NextResponse.json({ error: 'Reel no encontrado.' }, { status: 404 });
  }

  await writeBlobManifest({ version: 1, items });
  return NextResponse.json({ ok: true });
}
