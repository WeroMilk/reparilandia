import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const MIN_SCALE = 0.82;
const SCALE_STEP = 0.02;

function getMaxScale(zoneHeight: number, viewportWidth: number, isTimeline: boolean): number {
  if (isTimeline) {
    if (zoneHeight >= 520 || viewportWidth >= 400) return 1.04;
    if (zoneHeight >= 440) return 1;
    return 0.96;
  }
  if (zoneHeight >= 600 || viewportWidth >= 430) return 1.18;
  if (zoneHeight >= 520 || viewportWidth >= 390) return 1.12;
  if (zoneHeight >= 440) return 1.02;
  if (zoneHeight >= 380) return 0.98;
  return 0.95;
}

function measureTextFit(
  container: HTMLElement,
  textEl: HTMLElement,
  chromeEls: HTMLElement[],
  extraGap = 0,
): { fits: boolean; available: number; contentHeight: number } {
  const containerRect = container.getBoundingClientRect();
  const containerStyle = getComputedStyle(container);
  const padY =
    parseFloat(containerStyle.paddingTop || '0') +
    parseFloat(containerStyle.paddingBottom || '0');

  let chrome = 0;
  for (const el of chromeEls) {
    if (!el.isConnected) continue;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    chrome +=
      rect.height +
      parseFloat(style.marginTop || '0') +
      parseFloat(style.marginBottom || '0');
  }

  const available = Math.max(0, containerRect.height - padY - chrome - extraGap);
  const contentHeight = textEl.getBoundingClientRect().height;

  return {
    fits: contentHeight <= available + 2,
    available,
    contentHeight,
  };
}

function applyScale(screen: HTMLElement, target: HTMLElement, scale: number, varName: string) {
  const value = String(scale);
  target.style.setProperty(varName, value);
  screen.style.setProperty(varName, value);
}

function clearScale(screen: HTMLElement, target: HTMLElement | null, varName: string) {
  screen.style.removeProperty(varName);
  target?.style.removeProperty(varName);
}

/**
 * Escala el texto de Historia (móvil) para ocupar el panel sin huecos vacíos;
 * si no cabe al mínimo, activa scroll con el tamaño más grande posible.
 */
export function useHistoriaMobileFit(activeSlideIndex: number, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="historia"]') ??
      document.querySelector<HTMLElement>('.historia-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');
    const isTimeline = activeSlideIndex === 0;
    const scaleVar = isTimeline ? '--historia-timeline-scale' : '--historia-story-scale';

    const runFit = () => {
      if (desktopMq.matches) {
        screen.removeAttribute('data-historia-fit-ready');
        screen.removeAttribute('data-historia-scroll-fallback');
        screen.removeAttribute('data-historia-tall');
        clearScale(screen, null, scaleVar);
        screen.querySelectorAll<HTMLElement>('.historia-story-fit-text, .historia-timeline-fit-copy').forEach((el) => {
          el.style.removeProperty('--historia-story-scale');
          el.style.removeProperty('--historia-timeline-scale');
        });
        return;
      }

      if (!screen.hasAttribute('data-historia-layout-ready')) {
        screen.removeAttribute('data-historia-fit-ready');
        return;
      }

      const slides = screen.querySelectorAll<HTMLElement>(
        '.historia-timeline-slide, .historia-story-slide',
      );
      const slide = slides[activeSlideIndex];
      if (!slide) return;

      const panel = slide.querySelector<HTMLElement>('.historia-panel');
      if (!panel) return;

      const zoneVar = getComputedStyle(screen).getPropertyValue('--historia-mobile-zone-height');
      const zoneHeight = parseFloat(zoneVar) || panel.getBoundingClientRect().height;
      const vv = window.visualViewport;
      const viewportWidth = vv?.width ?? window.innerWidth;
      const isTallZone = zoneHeight >= 520;

      let textEl: HTMLElement | null = null;
      let measureContainer = panel;
      let chromeEls: HTMLElement[] = [];
      let extraGap = 0;

      if (isTimeline) {
        const copyCol = panel.querySelector<HTMLElement>('.historia-timeline-copy');
        textEl = panel.querySelector<HTMLElement>('.historia-timeline-fit-copy');
        const title = panel.querySelector<HTMLElement>('.historia-timeline-copy h3');
        if (copyCol) measureContainer = copyCol;
        chromeEls = title ? [title] : [];
      } else {
        textEl = panel.querySelector<HTMLElement>('.historia-story-fit-text');
        const char = panel.querySelector<HTMLElement>('.historia-story-char');
        const layout = panel.querySelector<HTMLElement>('.historia-story-layout');
        chromeEls = char ? [char] : [];
        measureContainer = isTallZone && layout ? layout : panel;
        extraGap = layout
          ? parseFloat(getComputedStyle(layout).gap || '0') ||
            parseFloat(getComputedStyle(layout).rowGap || '0')
          : 0;
      }

      if (!textEl) {
        screen.removeAttribute('data-historia-fit-ready');
        return;
      }
      if (isTallZone) {
        screen.setAttribute('data-historia-tall', 'true');
      } else {
        screen.removeAttribute('data-historia-tall');
      }

      const maxScale = getMaxScale(zoneHeight, viewportWidth, isTimeline);
      const growCap = isTimeline
        ? Math.round((maxScale + 0.1) * 1000) / 1000
        : Math.round((maxScale + (isTallZone ? 0.45 : 0.3)) * 1000) / 1000;
      const fillRatio = isTimeline ? 0.94 : isTallZone ? 0.998 : 0.992;
      let scale = maxScale;
      let measure = measureTextFit(measureContainer, textEl, chromeEls, extraGap);

      applyScale(screen, textEl, scale, scaleVar);
      measure = measureTextFit(measureContainer, textEl, chromeEls, extraGap);

      while (!measure.fits && scale > MIN_SCALE + 0.001) {
        scale = Math.max(MIN_SCALE, Math.round((scale - SCALE_STEP) * 1000) / 1000);
        applyScale(screen, textEl, scale, scaleVar);
        measure = measureTextFit(measureContainer, textEl, chromeEls, extraGap);
      }

      while (
        measure.fits &&
        measure.contentHeight < measure.available * fillRatio &&
        scale < growCap - 0.001
      ) {
        const next = Math.round((scale + SCALE_STEP) * 1000) / 1000;
        applyScale(screen, textEl, next, scaleVar);
        const trial = measureTextFit(measureContainer, textEl, chromeEls, extraGap);
        if (!trial.fits || trial.contentHeight > measure.available + 2) break;
        scale = next;
        measure = trial;
      }

      screen.setAttribute('data-historia-fit-ready', 'true');
      if (measure.fits) {
        screen.removeAttribute('data-historia-scroll-fallback');
      } else {
        screen.setAttribute('data-historia-scroll-fallback', 'true');
      }
    };

    const carousel = screen.querySelector('.historia-mobile-carousel');
    const dock = document.querySelector('[data-app-dock]');

    const cleanup = subscribeMobileLayout(runFit, {
      observe: [screen, carousel, dock],
      mediaQueries: [desktopMq],
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => runFit()).catch(() => {});
    }

    return () => {
      cleanup();
      screen.removeAttribute('data-historia-fit-ready');
      screen.removeAttribute('data-historia-scroll-fallback');
      screen.removeAttribute('data-historia-tall');
      clearScale(screen, null, scaleVar);
    };
  }, [activeSlideIndex, enabled]);
}
