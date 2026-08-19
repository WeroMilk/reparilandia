import { assetUrl } from '@/lib/assetUrl';
import type { ScreenName } from '@/types';

const SCREEN_ASSET_MAP: Record<ScreenName, readonly string[]> = {
  inicio: [
    '/assets/logo-reparilandia.png',
    '/assets/home-box-carritos.png',
    '/assets/home-box-servicio.png',
    '/assets/home-box-novedades.png',
  ],
  historia: [
    '/assets/historia-linea-tiempo.png',
    '/assets/historia-panel-2.png',
    '/assets/historia-panel-3.png',
    '/assets/historia-panel-4.png',
  ],
  servicios: ['/assets/hero-carritos-montables-taller.png'],
  noticias: ['/assets/noticias-monito-nave.png'],
  contacto: ['/assets/contacto-monito-izq-busto.png', '/assets/contacto-ilustracion-recuerdos.png'],
  reels: [],
};

const preloaded = new Set<string>();

function preloadPaths(paths: readonly string[]): void {
  if (typeof window === 'undefined') return;
  for (const path of paths) {
    const href = assetUrl(path);
    if (preloaded.has(href)) continue;
    preloaded.add(href);
    const img = new window.Image();
    img.decoding = 'async';
    img.src = href;
  }
}

export function preloadScreenAssets(screen: ScreenName = 'inicio'): void {
  preloadPaths(SCREEN_ASSET_MAP[screen] ?? []);
}
