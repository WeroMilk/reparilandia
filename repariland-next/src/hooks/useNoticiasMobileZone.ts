import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

/**
 * Altura de la zona útil en Noticias (móvil): entre cabecera y rail de 6 botones.
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

        const header = live.querySelector<HTMLElement>('.mobile-screen__header');
        const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
        if (!header || !navRail) {
          return;
        }

        const headerBottom = header.getBoundingClientRect().bottom;
        const navTop = navRail.getBoundingClientRect().top;
        const dock = document.querySelector<HTMLElement>('[data-app-dock]');
        const dockTop = dock?.getBoundingClientRect().top ?? navTop;
        const vv = window.visualViewport;
        const visibleBottom =
          vv != null ? vv.offsetTop + vv.height : window.innerHeight;
        const zoneBottom = Math.min(navTop, dockTop, visibleBottom);
        const height = Math.max(0, Math.round(zoneBottom - headerBottom));

        live.style.setProperty('--noticias-mobile-zone-height', `${height}px`);
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
