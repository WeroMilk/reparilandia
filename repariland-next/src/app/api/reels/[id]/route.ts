import { NextRequest, NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/reels/auth';
import {
  deleteReelVideo,
  getReelsManifest,
  hasWritableStorage,
  writeManifest,
} from '@/lib/reels/storage';
type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!hasWritableStorage()) {
    return NextResponse.json(
      { error: 'Eliminación no disponible sin almacenamiento en la nube.' },
      { status: 503 },
    );
  }

  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { id } = await context.params;
  const { manifest, storage } = await getReelsManifest();
  const removed = manifest.items.find((item) => item.id === id);
  const items = manifest.items.filter((item) => item.id !== id);

  if (items.length === manifest.items.length) {
    return NextResponse.json({ error: 'Reel no encontrado.' }, { status: 404 });
  }

  if (storage === 'supabase' || storage === 'blob') {
    if (removed) {
      await deleteReelVideo(id, removed.videoUrl, storage);
    }
    await writeManifest({ version: 1, items }, storage);
  }

  return NextResponse.json({ ok: true });
}
