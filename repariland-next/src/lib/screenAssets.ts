import { assetUrl } from '@/lib/assetUrl';
import type { ScreenName } from '@/types';

const SCREEN_ASSET_MAP: Record<ScreenName, readonly string[]> = {
  inicio: [
    '/assets/logo-reparilandia.webp',
    '/assets/home-box-carritos.webp',
    '/assets/home-box-servicio.webp',
    '/assets/home-box-novedades.webp',
  ],
  historia: [
    '/assets/historia-linea-tiempo.webp',
    '/assets/historia-panel-2.webp',
    '/assets/historia-panel-3.webp',
    '/assets/historia-panel-4.webp',
  ],
  servicios: [
    '/assets/hero-carritos-montables-taller.webp',
    '/assets/hero-servicio-laptops.webp',
    '/assets/hero-servicio-pc.webp',
  ],
  noticias: ['/assets/noticias-monito-nave.webp'],
  contacto: [
    '/assets/contacto-monito-izq-busto.webp',
    '/assets/contacto-ilustracion-recuerdos.webp',
  ],
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

/** Precarga inmediata de Inicio (sin esperar idle). */
export function preloadCriticalInicioAssets(): void {
  preloadPaths(SCREEN_ASSET_MAP.inicio);
}
