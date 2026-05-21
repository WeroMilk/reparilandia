import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const MIN_SCALE = 0.78;
const SCALE_STEP = 0.025;
function getMaxScale(zoneHeight: number, viewportWidth: number, showMessage: boolean): number {
  if (showMessage) {
    if (zoneHeight >= 560 || viewportWidth >= 400) return 1.12;
    if (zoneHeight >= 480) return 1.06;
    if (zoneHeight >= 400) return 1;
    return 0.94;
  }
  if (zoneHeight >= 640 || viewportWidth >= 430) return 1.32;
  if (zoneHeight >= 580 || viewportWidth >= 400) return 1.24;
  if (zoneHeight >= 520) return 1.16;
  if (zoneHeight >= 460) return 1.08;
  if (zoneHeight >= 400) return 1.02;
  return 0.94;
}

function getFitContentHeight(fitRoot: HTMLElement): number {
  const style = getComputedStyle(fitRoot);
  const gap = parseFloat(style.gap || '0') || parseFloat(style.rowGap || '0');
  const children = Array.from(fitRoot.children).filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  );
  if (children.length === 0) {
    return fitRoot.scrollHeight;
  }

  let sum = 0;
  children.forEach((child, index) => {
    if (index > 0) sum += gap;
    const childStyle = getComputedStyle(child);
    const rect = child.getBoundingClientRect();
    sum +=
      rect.height +
      parseFloat(childStyle.marginTop || '0') +
      parseFloat(childStyle.marginBottom || '0');
  });

  return Math.max(sum, fitRoot.scrollHeight);
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
  const scaleVar = parseFloat(
    getComputedStyle(fitRoot).getPropertyValue('--contacto-ui-scale') || '1',
  );
  const zoom =
    parseFloat(getComputedStyle(fitRoot).zoom || '1') ||
    (Number.isFinite(scaleVar) && scaleVar > 0 ? scaleVar : 1);
  const contentHeight = getFitContentHeight(fitRoot) * zoom;
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
        clearScale(screen, root?.querySelector('.contacto-mobile-sections') as HTMLElement | null ?? root);
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
      const fitRoot = showMessage
        ? box?.querySelector<HTMLElement>('.contacto-mobile-message-form.contacto-mobile-fit-root')
        : box?.querySelector<HTMLElement>('.contacto-mobile-card-body.contacto-mobile-fit-root');

      if (!box || !fitRoot) {
        screen.removeAttribute('data-contacto-fit-ready');
        return;
      }

      const zoneVar = getComputedStyle(screen).getPropertyValue('--contacto-mobile-zone-height');
      const zoneHeight = parseFloat(zoneVar) || box.getBoundingClientRect().height;
      const vv = window.visualViewport;
      const viewportWidth = vv?.width ?? window.innerWidth;

      const actionsEl = !showMessage
        ? box.querySelector<HTMLElement>('.contacto-mobile-actions')
        : null;
      const socialEl = !showMessage
        ? box.querySelector<HTMLElement>('.contacto-mobile-social')
        : null;

      const chromeEls = showMessage
        ? Array.from(
            box.querySelectorAll<HTMLElement>(
              '.contacto-mobile-message-chrome, .contacto-mobile-message-title',
            ),
          )
        : [socialEl, actionsEl].filter(Boolean) as HTMLElement[];

      const messageScroll = showMessage
        ? box.querySelector<HTMLElement>('.contacto-mobile-message-scroll')
        : null;

      const sectionsEl = !showMessage
        ? fitRoot.querySelector<HTMLElement>('.contacto-mobile-sections')
        : null;
      const measureContainer = showMessage ? (messageScroll ?? box) : box;
      const scaleTarget = showMessage ? fitRoot : (sectionsEl ?? fitRoot);

      const measureChrome = showMessage ? chromeEls : [socialEl, actionsEl].filter(Boolean) as HTMLElement[];

      const maxScale = getMaxScale(zoneHeight, viewportWidth, showMessage);
      const growCap = Math.round((maxScale + (showMessage ? 0.12 : 0.28)) * 1000) / 1000;
      let scale = maxScale;

      applyScale(screen, scaleTarget, scale);
      let measure = measureFit(measureContainer, scaleTarget, measureChrome);

      while (!measure.fits && scale > MIN_SCALE + 0.001) {
        scale = Math.max(MIN_SCALE, Math.round((scale - SCALE_STEP) * 1000) / 1000);
        applyScale(screen, scaleTarget, scale);
        measure = measureFit(measureContainer, scaleTarget, measureChrome);
      }

      const growTarget = showMessage ? 0.96 : 0.98;
      while (
        measure.fits &&
        measure.contentHeight < measure.available * growTarget &&
        scale < growCap - 0.001
      ) {
        const next = Math.round((scale + SCALE_STEP) * 1000) / 1000;
        applyScale(screen, scaleTarget, next);
        const trial = measureFit(measureContainer, scaleTarget, measureChrome);
        if (!trial.fits || trial.contentHeight > measure.available + 2) break;
        scale = next;
        measure = trial;
      }

      const slack = Math.max(0, measure.available - measure.contentHeight);
      const sectionGap = Math.round(
        Math.min(22, Math.max(5, slack * 0.42 + (showMessage ? 4 : 6))),
      );
      screen.style.setProperty('--contacto-mobile-section-gap', `${sectionGap}px`);
      screen.style.setProperty(
        '--contacto-mobile-actions-gap',
        `${Math.min(12, Math.max(4, sectionGap))}px`,
      );
      screen.style.setProperty(
        '--contacto-mobile-actions-pad-top',
        `${Math.min(16, Math.max(6, sectionGap + 2))}px`,
      );

      if (actionsEl) {
        const actionsBand = Math.ceil(actionsEl.getBoundingClientRect().height);
        screen.style.setProperty(
          '--contacto-mobile-actions-band',
          `${Math.max(104, actionsBand)}px`,
        );
      } else {
        screen.style.removeProperty('--contacto-mobile-actions-band');
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
      screen.style.removeProperty('--contacto-mobile-section-gap');
      screen.style.removeProperty('--contacto-mobile-actions-gap');
      screen.style.removeProperty('--contacto-mobile-actions-pad-top');
      screen.style.removeProperty('--contacto-mobile-actions-band');
      const root = screen.querySelector<HTMLElement>('.contacto-mobile-fit-root');
      const sections = root?.querySelector<HTMLElement>('.contacto-mobile-sections');
      clearScale(screen, sections ?? root);
    };
  }, [showMessage, enabled]);
}
