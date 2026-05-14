/** Evita caché agresivo al sustituir PNG en public/assets. Define NEXT_PUBLIC_ASSET_VERSION en .env.local */
export function assetUrl(path: string): string {
  if (!path.startsWith('/')) return path;
  const version =
    (typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_ASSET_VERSION?.trim()) ||
    '15';
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}v=${version}`;
}
