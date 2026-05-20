import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

/**
 * Altura de la zona de los 3 boxes en Inicio (móvil): entre fin de cabecera móvil y rail de 6 botones.
 */
export function useInicioMobileBoxesZone(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="inicio"]') ??
      document.querySelector<HTMLElement>('.inicio-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const measure = () => {
      if (desktopMq.matches) {
        screen.removeAttribute('data-inicio-layout-ready');
        screen.style.removeProperty('--inicio-mobile-boxes-zone-height');
        return;
      }

      const topBlock = screen.querySelector<HTMLElement>('.inicio-mobile-top');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      if (!topBlock || !navRail) {
        screen.removeAttribute('data-inicio-layout-ready');
        screen.style.removeProperty('--inicio-mobile-boxes-zone-height');
        return;
      }

      const zoneTop = topBlock.getBoundingClientRect().bottom;
      const navTop = navRail.getBoundingClientRect().top;
      const vv = window.visualViewport;
      const visibleBottom =
        vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      const visibleNavTop = Math.min(navTop, visibleBottom);
      const bottomReserve = 10;

      const height = Math.max(
        0,
        Math.round(visibleNavTop - zoneTop - bottomReserve),
      );

      screen.style.setProperty('--inicio-mobile-boxes-zone-height', `${height}px`);
      screen.setAttribute('data-inicio-layout-ready', 'true');
    };

    const topBlock = screen.querySelector('.inicio-mobile-top');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');

    return subscribeMobileLayout(measure, {
      observe: [screen, topBlock, navRail, dock],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
