import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const MIN_SCALE = 0.76;
const SCALE_STEP = 0.025;
/** Espacio reservado para WhatsApp + MENSAJE (móvil contacto). */
const CONTACTO_MOBILE_ACTIONS_RESERVE_PX = 118;

function getMaxScale(zoneHeight: number, viewportWidth: number): number {
  if (zoneHeight >= 560 || viewportWidth >= 430) return 1.08;
  if (zoneHeight >= 500 || viewportWidth >= 390) return 1.02;
  if (zoneHeight >= 440) return 0.96;
  if (zoneHeight >= 380) return 0.9;
  return 0.86;
}

function measureFit(
  box: HTMLElement,
  fitRoot: HTMLElement,
  chromeEls: HTMLElement[],
): { fits: boolean; contentHeight: number; available: number } {
  const boxRect = box.getBoundingClientRect();
  let chrome = 0;
  for (const el of chromeEls) {
    if (!el.isConnected) continue;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    chrome += rect.height + parseFloat(style.marginTop || '0') + parseFloat(style.marginBottom || '0');
  }
  const boxStyle = getComputedStyle(box);
  const padY =
    parseFloat(boxStyle.paddingTop || '0') + parseFloat(boxStyle.paddingBottom || '0');
  const gap = parseFloat(boxStyle.gap || '0') || parseFloat(boxStyle.rowGap || '0');
  const available = Math.max(0, boxRect.height - chrome - padY - gap * Math.max(0, chromeEls.length - 1));
  const contentHeight = fitRoot.getBoundingClientRect().height;
  return {
    fits: contentHeight <= available + 2,
    contentHeight,
    available,
  };
}

function applyScale(screen: HTMLElement, fitRoot: HTMLElement, scale: number) {
  const value = String(scale);
  fitRoot.style.setProperty('--contacto-ui-scale', value);
  screen.style.setProperty('--contacto-ui-scale', value);
}

function clearScale(screen: HTMLElement, fitRoot: HTMLElement | null) {
  screen.style.removeProperty('--contacto-ui-scale');
  if (!fitRoot) return;
  fitRoot.style.removeProperty('--contacto-ui-scale');
}

/**
 * Escala tipografía/espaciado del box de contacto o mensaje (móvil) para evitar scroll
 * cuando cabe; si no cabe ni al mínimo, activa scroll con texto lo más grande posible.
 */
export function useContactoMobileFit(showMessage: boolean, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="contacto"]') ??
      document.querySelector<HTMLElement>('.contacto-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const runFit = () => {
      if (desktopMq.matches) {
        screen.removeAttribute('data-contacto-fit-ready');
        screen.removeAttribute('data-contacto-scroll-fallback');
        screen.style.removeProperty('--contacto-ui-scale');
        const root = screen.querySelector<HTMLElement>('.contacto-mobile-fit-root');
        clearScale(screen, root);
        return;
      }

      if (!screen.hasAttribute('data-contacto-layout-ready')) {
        screen.removeAttribute('data-contacto-fit-ready');
        return;
      }

      const wrap = screen.querySelector<HTMLElement>('.contacto-mobile-wrap');
      const box = showMessage
        ? wrap?.querySelector<HTMLElement>('.contacto-mobile-message')
        : wrap?.querySelector<HTMLElement>('.contacto-mobile-card');
      const fitRoot = box?.querySelector<HTMLElement>('.contacto-mobile-fit-root');

      if (!box || !fitRoot) {
        screen.removeAttribute('data-contacto-fit-ready');
        return;
      }

      const zoneVar = getComputedStyle(screen).getPropertyValue('--contacto-mobile-zone-height');
      const zoneHeight = parseFloat(zoneVar) || box.getBoundingClientRect().height;
      const vv = window.visualViewport;
      const viewportWidth = vv?.width ?? window.innerWidth;

      const chromeEls = showMessage
        ? Array.from(
            box.querySelectorAll<HTMLElement>(
              '.contacto-mobile-message-chrome, .contacto-mobile-message-title',
            ),
          )
        : Array.from(box.querySelectorAll<HTMLElement>('.contacto-mobile-actions'));

      let chromeHeight = 0;
      for (const el of chromeEls) {
        if (!el.isConnected) continue;
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        chromeHeight +=
          rect.height +
          parseFloat(style.marginTop || '0') +
          parseFloat(style.marginBottom || '0');
      }
      if (!showMessage) {
        chromeHeight = Math.max(chromeHeight, CONTACTO_MOBILE_ACTIONS_RESERVE_PX);
      }

      const maxScale = getMaxScale(zoneHeight, viewportWidth);
      let scale = maxScale;

      const measureWithReserve = () => {
        const boxRect = box.getBoundingClientRect();
        const boxStyle = getComputedStyle(box);
        const padY =
          parseFloat(boxStyle.paddingTop || '0') + parseFloat(boxStyle.paddingBottom || '0');
        const available = Math.max(0, boxRect.height - chromeHeight - padY);
        const contentHeight = fitRoot.getBoundingClientRect().height;
        return {
          fits: contentHeight <= available + 2,
          available,
          contentHeight,
        };
      };

      applyScale(screen, fitRoot, scale);
      let measure = measureWithReserve();

      while (!measure.fits && scale > MIN_SCALE + 0.001) {
        scale = Math.max(MIN_SCALE, Math.round((scale - SCALE_STEP) * 1000) / 1000);
        applyScale(screen, fitRoot, scale);
        measure = measureWithReserve();
      }

      screen.setAttribute('data-contacto-fit-ready', 'true');

      if (measure.fits) {
        screen.removeAttribute('data-contacto-scroll-fallback');
      } else {
        screen.setAttribute('data-contacto-scroll-fallback', 'true');
      }
    };

    const wrap = screen.querySelector('.contacto-mobile-wrap');
    const dock = document.querySelector('[data-app-dock]');

    const cleanup = subscribeMobileLayout(runFit, {
      observe: [screen, wrap, dock],
      mediaQueries: [desktopMq],
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => runFit()).catch(() => {});
    }

    return () => {
      cleanup();
      screen.removeAttribute('data-contacto-fit-ready');
      screen.removeAttribute('data-contacto-scroll-fallback');
      screen.style.removeProperty('--contacto-ui-scale');
      const root = screen.querySelector<HTMLElement>('.contacto-mobile-fit-root');
      clearScale(screen, root);
    };
  }, [showMessage, enabled]);
}
