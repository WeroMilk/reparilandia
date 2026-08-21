import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';
import { measureMobileContentZone } from '@/lib/mobileContentZone';

const DOCK_CLEARANCE_PX = 6;

/**
 * Altura de la zona útil en Contacto (móvil): entre cabecera y rail de 6 botones.
 * Misma medición VV que Safari real (no el alto “lleno” de Chrome inspect).
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
        screen.removeAttribute('data-contacto-compact-zone');
        screen.style.removeProperty('--contacto-mobile-zone-height');
        return;
      }

      const zone = measureMobileContentZone(screen, { dockClearancePx: DOCK_CLEARANCE_PX });
      if (!zone || zone.zoneHeight < 120) {
        screen.removeAttribute('data-contacto-layout-ready');
        return;
      }

      screen.style.setProperty('--contacto-mobile-zone-height', `${zone.zoneHeight}px`);
      screen.setAttribute('data-contacto-layout-ready', 'true');
      if (zone.zoneHeight < 480) {
        screen.setAttribute('data-contacto-compact-zone', 'true');
      } else {
        screen.removeAttribute('data-contacto-compact-zone');
      }
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
