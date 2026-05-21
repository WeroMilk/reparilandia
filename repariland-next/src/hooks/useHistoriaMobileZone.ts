import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

/**
 * Altura de la zona útil en Historia (móvil): entre cabecera y rail de 6 botones.
 */
export function useHistoriaMobileZone(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="historia"]') ??
      document.querySelector<HTMLElement>('.historia-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const measure = () => {
      if (desktopMq.matches) {
        screen.removeAttribute('data-historia-layout-ready');
        screen.style.removeProperty('--historia-mobile-zone-height');
        screen.style.removeProperty('--historia-mobile-nav-height');
        return;
      }

      const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      if (!header || !navRail) {
        screen.removeAttribute('data-historia-layout-ready');
        screen.style.removeProperty('--historia-mobile-zone-height');
        screen.style.removeProperty('--historia-mobile-nav-height');
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

      const navHeight = Math.round(Math.min(Math.max(60, height * 0.12), 76));

      screen.style.setProperty('--historia-mobile-zone-height', `${height}px`);
      screen.style.setProperty('--historia-mobile-nav-height', `${navHeight}px`);
      screen.style.setProperty('--historia-mobile-panel-gap', '0.35rem');
      screen.setAttribute('data-historia-layout-ready', 'true');
    };

    const header = screen.querySelector('.mobile-screen__header');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');

    return subscribeMobileLayout(measure, {
      observe: [screen, header, navRail, dock],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
