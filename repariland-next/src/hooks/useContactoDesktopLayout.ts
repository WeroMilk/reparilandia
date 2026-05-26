import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

/** Bloque de contenido desktop (sin cabecera CONTACTO): diseño de referencia. */
const DESIGN_CANVAS_W = 1180;
const DESIGN_CANVAS_H = 560;
const DOCK_CLEARANCE_PX = 14;

/**
 * Escala uniforme del layout desktop de Contacto para que se vea igual en todos los monitores.
 */
export function useContactoDesktopLayout(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="contacto"]') ??
      document.querySelector<HTMLElement>('.contacto-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const clear = () => {
      screen.removeAttribute('data-contacto-desktop-ready');
      screen.style.removeProperty('--contacto-desktop-zone-height');
      screen.style.removeProperty('--contacto-canvas-scale');
      screen.style.removeProperty('--contacto-canvas-layout-h');
    };

    const measure = () => {
      if (!desktopMq.matches) {
        clear();
        return;
      }

      const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
      const body = screen.querySelector<HTMLElement>('.mobile-screen__body');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      if (!header || !body || !navRail) {
        clear();
        return;
      }

      const headerBottom = header.getBoundingClientRect().bottom;
      const navTop = navRail.getBoundingClientRect().top;
      const vv = window.visualViewport;
      const visibleBottom =
        vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      const zoneBottom = Math.min(navTop, visibleBottom) - DOCK_CLEARANCE_PX;
      const zoneHeight = Math.max(0, Math.round(zoneBottom - headerBottom));
      const zoneWidth = Math.max(0, Math.round(body.getBoundingClientRect().width));

      const scale = Math.min(1, zoneWidth / DESIGN_CANVAS_W, zoneHeight / DESIGN_CANVAS_H);
      const scaleRounded = Math.round(scale * 1000) / 1000;
      const layoutH = Math.round(DESIGN_CANVAS_H * scaleRounded);

      screen.style.setProperty('--contacto-desktop-zone-height', `${zoneHeight}px`);
      screen.style.setProperty('--contacto-canvas-scale', String(scaleRounded));
      screen.style.setProperty('--contacto-canvas-layout-h', `${layoutH}px`);
      screen.setAttribute('data-contacto-desktop-ready', 'true');
    };

    const header = screen.querySelector('.mobile-screen__header');
    const body = screen.querySelector('.mobile-screen__body');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');
    const canvas = screen.querySelector('.contacto-desktop-canvas');

    return subscribeMobileLayout(measure, {
      observe: [screen, header, body, canvas, navRail, dock],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
