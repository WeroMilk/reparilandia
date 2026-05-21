import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const STACK_GAP_PX = 16;
const DOCK_CLEARANCE_PX = 10;

/**
 * Escritorio INICIO: reserva altura entre cabecera y dock para que garantía + 3 boxes
 * quepan enteros en cualquier monitor (sin tocar móvil).
 */
export function useInicioDesktopFit(enabled: boolean) {
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
      screen.style.removeProperty('--inicio-desktop-stack-max');
      screen.style.removeProperty('--inicio-desktop-boxes-max');
    };

    const measure = () => {
      if (!desktopMq.matches) {
        clear();
        return;
      }

      const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
      const hero = screen.querySelector<HTMLElement>('.inicio-desktop-hero');
      const stack = screen.querySelector<HTMLElement>('.inicio-desktop-even');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      if (!header || !hero || !stack || !navRail) {
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
      const stackMax = Math.max(
        120,
        zoneHeight - heroHeight - STACK_GAP_PX,
      );

      const boxesMax = Math.max(96, Math.round(stackMax * 0.52));

      screen.style.setProperty('--inicio-desktop-zone-height', `${zoneHeight}px`);
      screen.style.setProperty('--inicio-desktop-stack-max', `${stackMax}px`);
      screen.style.setProperty('--inicio-desktop-boxes-max', `${boxesMax}px`);
      screen.setAttribute('data-inicio-desktop-ready', 'true');
    };

    const header = screen.querySelector('.mobile-screen__header');
    const hero = screen.querySelector('.inicio-desktop-hero');
    const stack = screen.querySelector('.inicio-desktop-even');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');

    return subscribeMobileLayout(measure, {
      observe: [screen, header, hero, stack, navRail, dock],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
