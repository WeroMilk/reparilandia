/** Validación compartida (cliente y API) para cotización y contacto. */

export const MAX_FORM_FIELD = 4000;
/** Límite Vercel ~4.5 MB por petición; dejamos margen para multipart. */
export const MAX_FILE_BYTES = 4 * 1024 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ALLOWED_IMAGE_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
]);

const ALLOWED_IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif']);

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= 254 && EMAIL_RE.test(trimmed);
}

export function trimFormField(value: string, max = MAX_FORM_FIELD): string {
  return value.trim().slice(0, max);
}

/** Acepta MIME conocido o extensión (móvil a veces deja type vacío). */
export function isAllowedImageFile(file: File): boolean {
  if (file.type && ALLOWED_IMAGE_MIME.has(file.type)) return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return Boolean(ext && ALLOWED_IMAGE_EXT.has(ext));
}

export const ALLOWED_IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif';
