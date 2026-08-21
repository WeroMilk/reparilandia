import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';
import { measureMobileContentZone } from '@/lib/mobileContentZone';

const DOCK_CLEARANCE_PX = 10;

/**
 * Altura de la zona útil en Historia (móvil): entre cabecera y dock.
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

      const zone = measureMobileContentZone(screen, { dockClearancePx: DOCK_CLEARANCE_PX });
      if (!zone || zone.zoneHeight < 120) {
        screen.removeAttribute('data-historia-layout-ready');
        return;
      }

      const navHeight = Math.round(Math.min(Math.max(60, zone.zoneHeight * 0.12), 76));

      screen.style.setProperty('--historia-mobile-zone-height', `${zone.zoneHeight}px`);
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
