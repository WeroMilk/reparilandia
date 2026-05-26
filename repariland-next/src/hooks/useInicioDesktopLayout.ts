import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const DOCK_CLEARANCE_PX = 14;
const MIN_BOXES_HEIGHT_PX = 196;

/**
 * Reparto vertical en Inicio (escritorio): altura real para los 3 boxes con caricaturas.
 */
export function useInicioDesktopLayout(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="inicio"]') ??
      document.querySelector<HTMLElement>('.inicio-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const clear = () => {
      screen.removeAttribute('data-inicio-desktop-ready');
      screen.style.removeProperty('--inicio-desktop-zone-height');
      screen.style.removeProperty('--inicio-desktop-boxes-height');
      screen.style.removeProperty('--inicio-desktop-stack-max');
    };

    const measure = () => {
      if (!desktopMq.matches) {
        clear();
        return;
      }

      const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
      const hero = screen.querySelector<HTMLElement>('.inicio-desktop-hero');
      const even = screen.querySelector<HTMLElement>('.inicio-desktop-even');
      const trust = screen.querySelector<HTMLElement>('.inicio-desktop-trust');
      const boxes = screen.querySelector<HTMLElement>('.inicio-desktop-boxes');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      if (!header || !hero || !even || !navRail) {
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

      const heroHeight = Math.ceil(hero.getBoundingClientRect().height);
      const trustHeight = trust ? Math.ceil(trust.getBoundingClientRect().height) : 0;
      const evenStyles = window.getComputedStyle(even);
      const evenGap =
        parseFloat(evenStyles.rowGap || evenStyles.gap || '0') || 0;
      const evenPad =
        (parseFloat(evenStyles.paddingTop) || 0) +
        (parseFloat(evenStyles.paddingBottom) || 0);
      const evenMargin =
        (parseFloat(evenStyles.marginTop) || 0) +
        (parseFloat(evenStyles.marginBottom) || 0);

      const stackMax = Math.max(0, zoneHeight - heroHeight);
      const boxesHeight = Math.max(
        MIN_BOXES_HEIGHT_PX,
        stackMax - trustHeight - evenGap - evenPad - evenMargin,
      );

      screen.style.setProperty('--inicio-desktop-zone-height', `${zoneHeight}px`);
      screen.style.setProperty('--inicio-desktop-boxes-height', `${boxesHeight}px`);
      screen.style.setProperty('--inicio-desktop-stack-max', `${stackMax}px`);
      screen.setAttribute('data-inicio-desktop-ready', 'true');

      if (boxes) {
        void boxes.offsetHeight;
      }
    };

    const header = screen.querySelector('.mobile-screen__header');
    const hero = screen.querySelector('.inicio-desktop-hero');
    const even = screen.querySelector('.inicio-desktop-even');
    const trust = screen.querySelector('.inicio-desktop-trust');
    const boxes = screen.querySelector('.inicio-desktop-boxes');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');

    const runMeasure = () => {
      measure();
      requestAnimationFrame(() => {
        measure();
        requestAnimationFrame(measure);
      });
    };

    return subscribeMobileLayout(runMeasure, {
      observe: [screen, header, hero, even, trust, boxes, navRail, dock],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
