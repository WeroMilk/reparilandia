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

    const clearZone = () => {
      screen.removeAttribute('data-inicio-layout-ready');
      screen.style.removeProperty('--inicio-mobile-boxes-zone-height');
      screen.style.removeProperty('--inicio-mobile-carousel-foot-reserve');
      screen.style.removeProperty('--inicio-mobile-boxes-pad-y');
      screen.style.removeProperty('--inicio-mobile-box-bottom-gap');
      screen.style.removeProperty('--inicio-mobile-card-edge-clearance');
    };

    const measureFootReserve = () => {
      const boxesEl = screen.querySelector<HTMLElement>('.inicio-mobile-boxes');
      const foot = boxesEl?.querySelector<HTMLElement>('.inicio-mobile-carousel-foot');
      const footHeight = foot
        ? Math.ceil(foot.getBoundingClientRect().height)
        : 34;
      const boxesStyle = boxesEl ? getComputedStyle(boxesEl) : null;
      const boxesPadY = boxesStyle
        ? parseFloat(boxesStyle.paddingTop || '0') +
          parseFloat(boxesStyle.paddingBottom || '0')
        : 18;

      screen.style.setProperty(
        '--inicio-mobile-carousel-foot-reserve',
        `${footHeight + 10}px`,
      );
      screen.style.setProperty('--inicio-mobile-boxes-pad-y', `${Math.ceil(boxesPadY)}px`);
    };

    const measure = () => {
      if (desktopMq.matches) {
        clearZone();
        return;
      }

      const topBlock = screen.querySelector<HTMLElement>('.inicio-mobile-top');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      if (!topBlock || !navRail) {
        clearZone();
        return;
      }

      const zoneTop = topBlock.getBoundingClientRect().bottom;
      const navTop = navRail.getBoundingClientRect().top;
      const dock = document.querySelector<HTMLElement>('[data-app-dock]');
      const dockTop = dock?.getBoundingClientRect().top ?? navTop;
      const vv = window.visualViewport;
      const visibleBottom =
        vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      const visibleNavTop = Math.min(navTop, dockTop, visibleBottom);
      const zoneSpan = Math.max(0, visibleNavTop - zoneTop);
      const boxBottomGap = Math.round(
        Math.min(Math.max(22, zoneSpan * 0.052), 40),
      );
      const cardEdgeClearance = 8;

      screen.style.setProperty('--inicio-mobile-box-bottom-gap', `${boxBottomGap}px`);
      screen.style.setProperty(
        '--inicio-mobile-card-edge-clearance',
        `${cardEdgeClearance}px`,
      );
      measureFootReserve();

      const boxesEl = screen.querySelector<HTMLElement>('.inicio-mobile-boxes');
      const boxesPadBottom = boxesEl
        ? parseFloat(getComputedStyle(boxesEl).paddingBottom || '0')
        : 14;
      const borderClearance = 18;
      const bottomReserve = Math.ceil(
        boxBottomGap + boxesPadBottom + borderClearance + cardEdgeClearance + 14,
      );

      const height = Math.max(0, Math.round(zoneSpan - bottomReserve));

      screen.style.setProperty('--inicio-mobile-boxes-zone-height', `${height}px`);
      screen.setAttribute('data-inicio-layout-ready', 'true');
    };

    const topBlock = screen.querySelector('.inicio-mobile-top');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');

    const boxes = screen.querySelector('.inicio-mobile-boxes');

    const runMeasure = () => {
      measure();
      requestAnimationFrame(() => measure());
    };

    return subscribeMobileLayout(runMeasure, {
      observe: [screen, topBlock, navRail, dock, boxes],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
