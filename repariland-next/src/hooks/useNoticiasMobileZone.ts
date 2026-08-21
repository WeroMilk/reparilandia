import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';
import { measureMobileContentZone } from '@/lib/mobileContentZone';

const DOCK_CLEARANCE_PX = 10;

/**
 * Altura de la zona útil en Noticias (móvil): entre cabecera y dock.
 */
export function useNoticiasMobileZone(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const start = () => {
      if (cancelled) return;
      const screen =
        document.querySelector<HTMLElement>('[data-screen="noticias"]') ??
        document.querySelector<HTMLElement>('.noticias-screen.screen-shell');
      if (!screen) {
        requestAnimationFrame(start);
        return;
      }

      const measure = () => {
        const live =
          document.querySelector<HTMLElement>('[data-screen="noticias"]') ??
          document.querySelector<HTMLElement>('.noticias-screen.screen-shell');
        if (!live) return;

        if (desktopMq.matches) {
          live.removeAttribute('data-noticias-layout-ready');
          live.style.removeProperty('--noticias-mobile-zone-height');
          return;
        }

        const zone = measureMobileContentZone(live, { dockClearancePx: DOCK_CLEARANCE_PX });
        if (!zone || zone.zoneHeight < 120) {
          live.removeAttribute('data-noticias-layout-ready');
          return;
        }

        live.style.setProperty('--noticias-mobile-zone-height', `${zone.zoneHeight}px`);
        live.setAttribute('data-noticias-layout-ready', 'true');
      };

      const header = screen.querySelector('.mobile-screen__header');
      const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
      const dock = document.querySelector('[data-app-dock]');

      cleanup = subscribeMobileLayout(measure, {
        observe: [screen, header, navRail, dock],
        mediaQueries: [desktopMq],
      });
    };

    start();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [enabled]);
}
