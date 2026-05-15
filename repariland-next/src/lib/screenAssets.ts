import { assetUrl } from '@/lib/assetUrl';

/** PNG servidos desde public/assets; precarga tras el boot para navegación instantánea. */
export const SCREEN_ASSET_PATHS = [
  '/assets/logo-reparilandia.png',
  '/assets/home-box-carritos.png',
  '/assets/home-box-servicio.png',
  '/assets/home-box-novedades.png',
  '/assets/historia-linea-tiempo.png',
  '/assets/historia-panel-2.png',
  '/assets/historia-panel-3.png',
  '/assets/historia-panel-4.png',
  '/assets/hero-reparamos-carritos.png',
  '/assets/noticias-monito-periodico.png',
  '/assets/contacto-monito-izq.png',
] as const;

const preloaded = new Set<string>();

export function preloadScreenAssets(): void {
  if (typeof window === 'undefined') return;

  for (const path of SCREEN_ASSET_PATHS) {
    const href = assetUrl(path);
    if (preloaded.has(href)) continue;
    preloaded.add(href);

    const img = new window.Image();
    img.decoding = 'async';
    img.src = href;
  }
}
