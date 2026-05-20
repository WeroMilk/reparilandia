import { ALLOWED_VIDEO_TYPES, MAX_REEL_DURATION_SEC, MAX_VIDEO_BYTES } from '@/lib/reels/constants';

export type VideoValidationResult =
  | { ok: true; durationSec: number }
  | { ok: false; error: string };

export function validateVideoFile(file: File): VideoValidationResult | Promise<VideoValidationResult> {
  if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
    return { ok: false, error: 'Formato no válido. Usa MP4 o WebM.' };
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return { ok: false, error: 'El video supera el tamaño máximo permitido (40 MB).' };
  }
  return readVideoDuration(file);
}

function readVideoDuration(file: File): Promise<VideoValidationResult> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        resolve({ ok: false, error: 'No se pudo leer la duración del video.' });
        return;
      }
      if (duration > MAX_REEL_DURATION_SEC) {
        resolve({
          ok: false,
          error: `El video debe durar máximo ${MAX_REEL_DURATION_SEC} segundos.`,
        });
        return;
      }
      resolve({ ok: true, durationSec: Math.round(duration * 10) / 10 });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ ok: false, error: 'No se pudo analizar el archivo de video.' });
    };
    video.src = url;
  });
}
