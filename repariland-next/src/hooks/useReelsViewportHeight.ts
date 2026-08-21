import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';
import { measureMobileContentZone } from '@/lib/mobileContentZone';

/** Marco vertical de referencia (estilo móvil / TikTok). */
const DESIGN_FRAME_W = 448;
const DESIGN_FRAME_H = 800;
const DOCK_CLEARANCE_PX = 10;

/**
 * Mide la zona útil del feed entre cabecera REELS y el dock.
 * En escritorio escala el marco 448×800 para que coincida en cualquier monitor.
 */
export function useReelsViewportHeight(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen = document.querySelector<HTMLElement>('[data-screen="reels"]');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const clear = () => {
      screen.removeAttribute('data-reels-layout-ready');
      screen.removeAttribute('data-reels-desktop-ready');
      screen.style.removeProperty('--reels-body-height');
      screen.style.removeProperty('--reels-canvas-scale');
      screen.style.removeProperty('--reels-frame-layout-h');
    };

    const measure = () => {
      const frame = screen.querySelector<HTMLElement>('.reels-screen__frame');
      const zone = measureMobileContentZone(screen, {
        dockClearancePx: DOCK_CLEARANCE_PX,
        headerSelector: '.reels-screen__header',
      });
      if (!zone || !frame) {
        clear();
        return;
      }

      screen.style.setProperty('--reels-body-height', `${zone.zoneHeight}px`);
      screen.setAttribute('data-reels-layout-ready', 'true');

      if (desktopMq.matches) {
        const screenTop = screen.getBoundingClientRect().top;
        const zoneHeight = Math.max(0, Math.round(zone.zoneBottom - screenTop));
        const zoneWidth = Math.max(0, Math.round(screen.getBoundingClientRect().width));
        const scale = Math.min(1, zoneWidth / DESIGN_FRAME_W, zoneHeight / DESIGN_FRAME_H);
        const scaleRounded = Math.round(scale * 1000) / 1000;
        const layoutH = Math.round(DESIGN_FRAME_H * scaleRounded);

        screen.style.setProperty('--reels-canvas-scale', String(scaleRounded));
        screen.style.setProperty('--reels-frame-layout-h', `${layoutH}px`);
        screen.setAttribute('data-reels-desktop-ready', 'true');
      } else {
        screen.removeAttribute('data-reels-desktop-ready');
        screen.style.removeProperty('--reels-canvas-scale');
        screen.style.removeProperty('--reels-frame-layout-h');
      }
    };

    const header = screen.querySelector('.reels-screen__header');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');
    const frame = screen.querySelector('.reels-screen__frame');

    return subscribeMobileLayout(measure, {
      observe: [screen, header, frame, navRail, dock],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
