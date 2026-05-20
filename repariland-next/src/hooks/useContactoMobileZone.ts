import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

/**
 * Altura de la zona útil en Contacto (móvil): entre cabecera y rail de 6 botones.
 */
export function useContactoMobileZone(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="contacto"]') ??
      document.querySelector<HTMLElement>('.contacto-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const measure = () => {
      if (desktopMq.matches) {
        screen.removeAttribute('data-contacto-layout-ready');
        screen.style.removeProperty('--contacto-mobile-zone-height');
        return;
      }

      const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      if (!header || !navRail) {
        screen.removeAttribute('data-contacto-layout-ready');
        screen.style.removeProperty('--contacto-mobile-zone-height');
        return;
      }

      const headerBottom = header.getBoundingClientRect().bottom;
      const navTop = navRail.getBoundingClientRect().top;
      const vv = window.visualViewport;
      const visibleBottom =
        vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      const height = Math.max(
        0,
        Math.round(Math.min(navTop, visibleBottom) - headerBottom),
      );

      screen.style.setProperty('--contacto-mobile-zone-height', `${height}px`);
      screen.setAttribute('data-contacto-layout-ready', 'true');
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
