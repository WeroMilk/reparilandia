import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const MIN_SCALE = 0.88;
const SCALE_STEP = 0.02;
const STORY_FONT_MIN_PX = 11;
const FILL_RATIO = 0.98;

function getTimelineMaxScale(zoneHeight: number, viewportWidth: number): number {
  if (zoneHeight >= 560 || viewportWidth >= 420) return 1.38;
  if (zoneHeight >= 500 || viewportWidth >= 390) return 1.32;
  if (zoneHeight >= 440) return 1.24;
  if (zoneHeight >= 380) return 1.16;
  return 1.08;
}

function getTimelineStartScale(zoneHeight: number): number {
  if (zoneHeight >= 500) return 1.12;
  if (zoneHeight >= 420) return 1.06;
  return 1;
}

function measureBlockFit(
  container: HTMLElement,
  blockEl: HTMLElement,
  chromeEls: HTMLElement[] = [],
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
  const contentHeight = blockEl.getBoundingClientRect().height;

  return {
    fits: contentHeight <= available + 2,
    available,
    contentHeight,
  };
}

function setPanelVar(panel: HTMLElement, name: string, value: string) {
  panel.style.setProperty(name, value);
}

function clearPanelVars(panel: HTMLElement) {
  panel.style.removeProperty('--historia-timeline-scale');
  panel.style.removeProperty('--historia-timeline-title-px');
  panel.style.removeProperty('--historia-et-scale');
  panel.style.removeProperty('--hm-story-figure-max-h');
  clearStoryPanelInlineStyles(panel);
  panel.removeAttribute('data-hm-fitted');
}

function fitEtColumn(panel: HTMLElement) {
  const etCol = panel.querySelector<HTMLElement>('.hm-timeline__et, .historia-et-col');
  const etImg = panel.querySelector<HTMLElement>('.hm-timeline__et-img, .historia-et-img');
  if (!etCol || !etImg) {
    panel.style.removeProperty('--historia-et-scale');
    return;
  }

  etImg.style.removeProperty('transform');
  const colRect = etCol.getBoundingClientRect();
  const imgRect = etImg.getBoundingClientRect();
  if (colRect.height < 8 || imgRect.height < 8) {
    setPanelVar(panel, '--historia-et-scale', '2.4');
    return;
  }

  const scaleByH = (colRect.height * 0.96) / imgRect.height;
  const scaleByW = (colRect.width * 0.96) / imgRect.width;
  const fitScale = Math.min(scaleByH, scaleByW);
  const etScale = Math.min(4.2, Math.max(2.1, fitScale * 2.55));
  setPanelVar(panel, '--historia-et-scale', String(Math.round(etScale * 1000) / 1000));
}

function growScaleToFill(
  panel: HTMLElement,
  target: HTMLElement,
  measureContainer: HTMLElement,
  varName: string,
  startScale: number,
  maxScale: number,
  chromeEls: HTMLElement[] = [],
): { fits: boolean; available: number; contentHeight: number } {
  let scale = startScale;
  let measure = measureBlockFit(measureContainer, target, chromeEls);

  setPanelVar(panel, varName, String(scale));
  target.style.setProperty(varName, String(scale));
  measure = measureBlockFit(measureContainer, target, chromeEls);

  while (!measure.fits && scale > MIN_SCALE + 0.001) {
    scale = Math.max(MIN_SCALE, Math.round((scale - SCALE_STEP) * 1000) / 1000);
    setPanelVar(panel, varName, String(scale));
    target.style.setProperty(varName, String(scale));
    measure = measureBlockFit(measureContainer, target, chromeEls);
  }

  const growCap = Math.round((maxScale + 0.06) * 1000) / 1000;
  while (
    measure.fits &&
    measure.contentHeight < measure.available * FILL_RATIO &&
    scale < growCap - 0.001
  ) {
    const next = Math.round((scale + SCALE_STEP) * 1000) / 1000;
    setPanelVar(panel, varName, String(next));
    target.style.setProperty(varName, String(next));
    const trial = measureBlockFit(measureContainer, target, chromeEls);
    if (!trial.fits || trial.contentHeight > measure.available + 2) break;
    scale = next;
    measure = trial;
  }

  return measure;
}

function clearStoryPanelInlineStyles(panel: HTMLElement) {
  panel.style.removeProperty('--historia-story-figure-scale');
  panel.style.removeProperty('--historia-story-name-px');
  panel.style.removeProperty('--historia-story-font-px');
  panel.style.removeProperty('--historia-story-line-px');
  panel.querySelectorAll<HTMLElement>('.historia-story-fit-text, .hm-story__name').forEach((el) => {
    el.style.removeProperty('font-size');
    el.style.removeProperty('line-height');
    el.style.removeProperty('transform');
  });
  panel.querySelectorAll<HTMLElement>('.hm-story__img').forEach((el) => {
    el.style.removeProperty('transform');
  });
}

function fitStoryFigure(panel: HTMLElement, figureEl: HTMLElement, imgEl: HTMLElement) {
  imgEl.style.removeProperty('transform');
  panel.style.removeProperty('--historia-story-figure-scale');

  const figRect = figureEl.getBoundingClientRect();
  const imgSlotH = Math.max(48, figRect.height - 2);

  const imgRect = imgEl.getBoundingClientRect();
  if (imgSlotH < 8 || imgRect.height < 8) {
    setPanelVar(panel, '--historia-story-figure-scale', '1.35');
    return;
  }

  const scaleByH = (imgSlotH * 0.96) / imgRect.height;
  const scaleByW = (figRect.width * 0.96) / imgRect.width;
  const scale = Math.min(3.4, Math.max(1.05, Math.min(scaleByH, scaleByW)));
  setPanelVar(panel, '--historia-story-figure-scale', String(Math.round(scale * 1000) / 1000));
}

function fitStoryName(panel: HTMLElement, nameEl: HTMLElement, zoneHeight: number) {
  const size = Math.min(26, Math.max(16, Math.round(14 + zoneHeight * 0.027)));
  nameEl.style.fontSize = `${size}px`;
  setPanelVar(panel, '--historia-story-name-px', `${size}px`);
}

function fillStoryLineHeight(
  panel: HTMLElement,
  textEl: HTMLElement,
  available: number,
  fontPx: number,
) {
  textEl.style.lineHeight = '1.32';
  const contentHeight = textEl.scrollHeight;
  if (contentHeight >= available * FILL_RATIO - 1) return;

  const lh = parseFloat(getComputedStyle(textEl).lineHeight) || fontPx * 1.32;
  const lines = Math.max(1, Math.ceil(contentHeight / lh));
  const targetLh = (available * FILL_RATIO) / lines;
  const maxLh = fontPx * 1.5;
  const nextLh = Math.min(maxLh, Math.max(lh, targetLh));
  textEl.style.lineHeight = `${nextLh.toFixed(2)}px`;
  setPanelVar(panel, '--historia-story-line-px', `${nextLh.toFixed(2)}px`);
}

/** Escala el párrafo al hueco del bloque centrado (caricatura + nombre + texto). */
function fitStoryTextFill(panel: HTMLElement, zoneHeight: number): boolean {
  const stackEl = panel.querySelector<HTMLElement>('.hm-story__stack');
  const panelMain = panel.querySelector<HTMLElement>('.hm-panel__main') ?? panel;
  const figureEl = panel.querySelector<HTMLElement>('.hm-story__figure');
  const nameEl = panel.querySelector<HTMLElement>('.hm-story__name');
  const textEl = panel.querySelector<HTMLElement>('.historia-story-fit-text');
  if (!stackEl || !figureEl || !nameEl || !textEl) return false;

  textEl.style.removeProperty('font-size');
  textEl.style.removeProperty('line-height');
  panel.style.removeProperty('--historia-story-font-px');
  panel.style.removeProperty('--historia-story-line-px');

  const panelStyle = getComputedStyle(panel);
  const panelPadY =
    parseFloat(panelStyle.paddingTop || '0') + parseFloat(panelStyle.paddingBottom || '0');
  const stackStyle = getComputedStyle(stackEl);
  const stackPadY =
    parseFloat(stackStyle.paddingTop || '0') + parseFloat(stackStyle.paddingBottom || '0');
  const gap =
    parseFloat(stackStyle.rowGap || '0') || parseFloat(stackStyle.gap || '0') || 0;

  const chromeHeights = [figureEl, nameEl].map((el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return (
      rect.height +
      parseFloat(style.marginTop || '0') +
      parseFloat(style.marginBottom || '0')
    );
  });
  const chrome = chromeHeights.reduce((sum, h) => sum + h, 0) + gap * 2;

  const available = Math.max(
    44,
    panelMain.getBoundingClientRect().height - panelPadY - stackPadY - chrome - 4,
  );

  const hiCap = Math.min(
    28,
    Math.max(
      13,
      Math.round(available / 4.1),
      Math.round(12 + zoneHeight * 0.03),
    ),
  );
  let lo = STORY_FONT_MIN_PX;
  let hi = hiCap;
  let best = lo;

  while (lo <= hi) {
    const mid = Math.round((lo + hi) / 2);
    textEl.style.fontSize = `${mid}px`;
    textEl.style.lineHeight = '1.32';
    if (textEl.scrollHeight <= available + 2) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  textEl.style.fontSize = `${best}px`;
  let contentHeight = textEl.scrollHeight;
  let fits = contentHeight <= available + 2;

  while (fits && contentHeight < available * FILL_RATIO && best < hiCap) {
    const trial = best + 1;
    textEl.style.fontSize = `${trial}px`;
    textEl.style.lineHeight = '1.32';
    const trialHeight = textEl.scrollHeight;
    if (trialHeight > available + 2) break;
    best = trial;
    contentHeight = trialHeight;
  }

  textEl.style.fontSize = `${best}px`;
  fillStoryLineHeight(panel, textEl, available, best);
  setPanelVar(panel, '--historia-story-font-px', `${best}px`);

  return textEl.scrollHeight <= available + 2;
}

/** Maximiza caricatura, nombre y texto dentro del box centrado. */
function fitStoryPanel(panel: HTMLElement, zoneHeight: number): { fits: boolean } {
  clearStoryPanelInlineStyles(panel);

  const figureEl = panel.querySelector<HTMLElement>('.hm-story__figure');
  const imgEl = panel.querySelector<HTMLElement>('.hm-story__img');
  const nameEl = panel.querySelector<HTMLElement>('.hm-story__name');

  const figureMaxPx = Math.round(Math.min(Math.max(zoneHeight * 0.44, 124), 232));
  panel.style.setProperty('--hm-story-figure-max-h', `${figureMaxPx}px`);

  if (figureEl && imgEl) fitStoryFigure(panel, figureEl, imgEl);
  if (nameEl) fitStoryName(panel, nameEl, zoneHeight);

  const fits = fitStoryTextFill(panel, zoneHeight);
  return { fits };
}

function fitTimelineTitle(panel: HTMLElement, titleEl: HTMLElement, zoneHeight: number) {
  const size = Math.min(
    17,
    Math.max(12, Math.round(11 + zoneHeight * 0.018)),
  );
  titleEl.style.fontSize = `${size}px`;
  setPanelVar(panel, '--historia-timeline-title-px', `${size}px`);
}

function fitTimelinePanel(
  panel: HTMLElement,
  zoneHeight: number,
  viewportWidth: number,
): { fits: boolean } {
  const panelMain = panel.querySelector<HTMLElement>('.hm-panel__main');
  const listEl = panel.querySelector<HTMLElement>('.hm-timeline__list');
  const titleEl = panel.querySelector<HTMLElement>('.hm-timeline__title');
  if (!panelMain || !listEl) return { fits: false };

  if (titleEl) fitTimelineTitle(panel, titleEl, zoneHeight);

  const maxScale = getTimelineMaxScale(zoneHeight, viewportWidth);
  const startScale = getTimelineStartScale(zoneHeight);
  const measure = growScaleToFill(
    panel,
    listEl,
    panelMain,
    '--historia-timeline-scale',
    startScale,
    maxScale,
    titleEl ? [titleEl] : [],
  );
  fitEtColumn(panel);
  return { fits: measure.fits };
}

function clearAllPanels(screen: HTMLElement) {
  screen.querySelectorAll<HTMLElement>('.hm-panel').forEach((panel) => {
    clearPanelVars(panel);
    panel.querySelectorAll<HTMLElement>('.historia-story-fit-text, .hm-story__name').forEach((el) => {
      el.style.removeProperty('font-size');
      el.style.removeProperty('line-height');
      el.style.removeProperty('transform');
    });
    panel.querySelectorAll<HTMLElement>('.hm-timeline__list').forEach((el) => {
      el.style.removeProperty('--historia-timeline-scale');
      el.style.removeProperty('transform');
    });
    panel.querySelectorAll<HTMLElement>('.hm-timeline__title').forEach((el) => {
      el.style.removeProperty('font-size');
    });
  });
}

/**
 * Escala los 4 paneles de Historia (móvil) de una vez para que el carrusel no “salte” al deslizar.
 */
export function useHistoriaMobileFit(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="historia"]') ??
      document.querySelector<HTMLElement>('.historia-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const runFit = () => {
      if (desktopMq.matches) {
        screen.removeAttribute('data-historia-fit-ready');
        screen.removeAttribute('data-historia-scroll-fallback');
        screen.removeAttribute('data-historia-tall');
        clearAllPanels(screen);
        return;
      }

      if (!screen.hasAttribute('data-historia-layout-ready')) {
        screen.removeAttribute('data-historia-fit-ready');
        screen.querySelectorAll<HTMLElement>('.hm-panel').forEach((panel) => {
          panel.setAttribute('data-hm-fitted', 'true');
        });
        return;
      }

      const zoneVar = getComputedStyle(screen).getPropertyValue('--historia-mobile-zone-height');
      const zoneHeight =
        parseFloat(zoneVar) ||
        screen.querySelector<HTMLElement>('.hm-panel')?.getBoundingClientRect().height ||
        0;
      const vv = window.visualViewport;
      const viewportWidth = vv?.width ?? window.innerWidth;
      const isTallZone = zoneHeight >= 520;

      const slides = screen.querySelectorAll<HTMLElement>(
        '.hm-slide, .historia-timeline-slide, .historia-story-slide',
      );

      let allFit = true;

      slides.forEach((slide, index) => {
        const panel = slide.querySelector<HTMLElement>('.hm-panel, .historia-panel');
        if (!panel) return;

        clearPanelVars(panel);

        const result =
          index === 0
            ? fitTimelinePanel(panel, zoneHeight, viewportWidth)
            : fitStoryPanel(panel, zoneHeight);

        if (!result.fits) allFit = false;
        panel.setAttribute('data-hm-fitted', 'true');
      });

      if (isTallZone) {
        screen.setAttribute('data-historia-tall', 'true');
      } else {
        screen.removeAttribute('data-historia-tall');
      }

      screen.setAttribute('data-historia-fit-ready', 'true');
      if (allFit) {
        screen.removeAttribute('data-historia-scroll-fallback');
      } else {
        screen.setAttribute('data-historia-scroll-fallback', 'true');
      }
    };

    const carousel = screen.querySelector('.hm-carousel, .historia-mobile-carousel');
    const body = screen.querySelector('.mobile-screen__body');
    const dock = document.querySelector('[data-app-dock]');

    const cleanup = subscribeMobileLayout(
      () => {
        runFit();
        requestAnimationFrame(() => {
          runFit();
          requestAnimationFrame(() => runFit());
        });
      },
      {
        observe: [screen, body, carousel, dock],
        mediaQueries: [desktopMq],
      },
    );

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => runFit()).catch(() => {});
    }

    return () => {
      cleanup();
      screen.removeAttribute('data-historia-fit-ready');
      screen.removeAttribute('data-historia-scroll-fallback');
      screen.removeAttribute('data-historia-tall');
      clearAllPanels(screen);
    };
  }, [enabled]);
}
