import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

/**
 * Altura de la zona útil en Servicios (móvil): entre cabecera y rail de 6 botones.
 */
export function useServiciosMobileZone(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="servicios"]') ??
      document.querySelector<HTMLElement>('.servicios-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const measure = () => {
      if (desktopMq.matches) {
        screen.removeAttribute('data-servicios-layout-ready');
        screen.style.removeProperty('--servicios-mobile-zone-height');
        screen.style.removeProperty('--servicios-mobile-carousel-zone-height');
        return;
      }

      const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
      const guarantee = screen.querySelector<HTMLElement>('.servicios-mobile-guarantee-wrap');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      if (!header || !navRail) {
        screen.removeAttribute('data-servicios-layout-ready');
        screen.style.removeProperty('--servicios-mobile-zone-height');
        screen.style.removeProperty('--servicios-mobile-carousel-zone-height');
        return;
      }

      const headerBottom = header.getBoundingClientRect().bottom;
      const navTop = navRail.getBoundingClientRect().top;
      const vv = window.visualViewport;
      const visibleBottom =
        vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      const visibleNavTop = Math.min(navTop, visibleBottom);

      const bodyHeight = Math.max(0, Math.round(visibleNavTop - headerBottom));
      const carouselTop = guarantee?.getBoundingClientRect().bottom ?? headerBottom;
      const carouselHeight = Math.max(0, Math.round(visibleNavTop - carouselTop));

      screen.style.setProperty('--servicios-mobile-zone-height', `${bodyHeight}px`);
      screen.style.setProperty(
        '--servicios-mobile-carousel-zone-height',
        `${carouselHeight}px`,
      );
      screen.setAttribute('data-servicios-layout-ready', 'true');
    };

    const header = screen.querySelector('.mobile-screen__header');
    const intro = screen.querySelector('.servicios-mobile-intro');
    const guarantee = screen.querySelector('.servicios-mobile-guarantee-wrap');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');

    return subscribeMobileLayout(measure, {
      observe: [screen, header, intro, guarantee, navRail, dock],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
