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
  panel.style.removeProperty('--historia-story-figure-scale');
  panel.style.removeProperty('--historia-story-name-px');
  panel.style.removeProperty('--historia-story-font-px');
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

function fitStoryFigure(
  panel: HTMLElement,
  figureEl: HTMLElement,
  imgEl: HTMLElement,
  nameEl: HTMLElement,
) {
  imgEl.style.removeProperty('transform');
  panel.style.removeProperty('--historia-story-figure-scale');

  const figRect = figureEl.getBoundingClientRect();
  const nameRect = nameEl.getBoundingClientRect();
  const figStyle = getComputedStyle(figureEl);
  const gap =
    parseFloat(figStyle.rowGap || '0') || parseFloat(figStyle.gap || '0') || 0;
  const imgSlotH = Math.max(40, figRect.height - nameRect.height - gap - 2);

  imgEl.style.removeProperty('transform');
  const imgRect = imgEl.getBoundingClientRect();
  if (imgSlotH < 8 || imgRect.height < 8) {
    setPanelVar(panel, '--historia-story-figure-scale', '1.65');
    return;
  }

  const scaleByH = (imgSlotH * 0.94) / imgRect.height;
  const scaleByW = (figRect.width * 0.94) / imgRect.width;
  const scale = Math.min(3.2, Math.max(1.12, Math.min(scaleByH, scaleByW)));
  setPanelVar(panel, '--historia-story-figure-scale', String(Math.round(scale * 1000) / 1000));
}

function fitStoryName(panel: HTMLElement, nameEl: HTMLElement, zoneHeight: number) {
  const size = Math.min(24, Math.max(15, Math.round(13 + zoneHeight * 0.021)));
  nameEl.style.fontSize = `${size}px`;
  setPanelVar(panel, '--historia-story-name-px', `${size}px`);
}

function fillStoryLineHeight(textEl: HTMLElement, available: number, fontPx: number) {
  textEl.style.lineHeight = '1.28';
  let contentHeight = textEl.scrollHeight;
  if (contentHeight >= available * FILL_RATIO - 1) return;

  const lh = parseFloat(getComputedStyle(textEl).lineHeight) || fontPx * 1.28;
  const lines = Math.max(1, Math.ceil(contentHeight / lh));
  const targetLh = (available * FILL_RATIO) / lines;
  const maxLh = fontPx * 1.58;
  textEl.style.lineHeight = `${Math.min(maxLh, Math.max(lh, targetLh)).toFixed(2)}px`;
}

function fitStoryText(
  panel: HTMLElement,
  copyEl: HTMLElement,
  textEl: HTMLElement,
  zoneHeight: number,
): { fits: boolean; available: number; contentHeight: number } {
  textEl.style.removeProperty('zoom');
  textEl.style.removeProperty('transform');
  textEl.style.removeProperty('line-height');

  const copyRect = copyEl.getBoundingClientRect();
  const copyStyle = getComputedStyle(copyEl);
  const padY =
    parseFloat(copyStyle.paddingTop || '0') + parseFloat(copyStyle.paddingBottom || '0');
  const border = parseFloat(copyStyle.borderTopWidth || '0');
  const available = Math.max(64, copyRect.height - padY - border - 2);

  const hiCap = Math.min(
    58,
    Math.max(
      17,
      Math.round(available * 0.42 + zoneHeight * 0.018),
      Math.floor((available / 5.2) * 1.05),
    ),
  );
  let lo = STORY_FONT_MIN_PX;
  let hi = hiCap;
  let best = lo;

  while (lo <= hi) {
    const mid = Math.round((lo + hi) / 2);
    textEl.style.fontSize = `${mid}px`;
    textEl.style.lineHeight = '1.28';
    const contentHeight = textEl.scrollHeight;
    if (contentHeight <= available + 2) {
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
    textEl.style.lineHeight = '1.28';
    const trialHeight = textEl.scrollHeight;
    if (trialHeight > available + 2) break;
    best = trial;
    contentHeight = trialHeight;
  }

  textEl.style.fontSize = `${best}px`;
  fillStoryLineHeight(textEl, available, best);
  setPanelVar(panel, '--historia-story-font-px', `${best}px`);

  contentHeight = textEl.scrollHeight;
  fits = contentHeight <= available + 2;

  return { fits, available, contentHeight };
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

function fitStoryPanel(panel: HTMLElement, zoneHeight: number): { fits: boolean } {
  const figureEl = panel.querySelector<HTMLElement>('.hm-story__figure, .historia-story-char');
  const imgEl = panel.querySelector<HTMLElement>('.hm-story__img');
  const nameEl = panel.querySelector<HTMLElement>('.hm-story__name');
  const copyEl = panel.querySelector<HTMLElement>('.hm-story__copy');
  const textEl = panel.querySelector<HTMLElement>('.historia-story-fit-text');

  if (!figureEl || !imgEl || !nameEl || !copyEl || !textEl) return { fits: false };

  fitStoryFigure(panel, figureEl, imgEl, nameEl);
  fitStoryName(panel, nameEl, zoneHeight);
  const measure = fitStoryText(panel, copyEl, textEl, zoneHeight);
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
