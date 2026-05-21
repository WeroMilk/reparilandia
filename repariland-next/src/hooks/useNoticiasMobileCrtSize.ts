import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

/** Pantalla CRT: más ancha que alta (5:4) — evita estiramiento vertical en móvil. */
const CRT_ASPECT = 5 / 4;
const BEZEL_CHROME_PX = 76;
const STAND_AND_DOTS_PX = 84;
const STAND_NO_DOTS_PX = 52;
const STAGE_GAP_PX = 6;

function getMonitoMaxPx(zoneHeight: number): number {
  if (zoneHeight >= 560) return Math.min(zoneHeight * 0.34, 158);
  if (zoneHeight >= 480) return Math.min(zoneHeight * 0.32, 142);
  return Math.min(zoneHeight * 0.3, 126);
}

/**
 * iPhone SE y móviles bajos: diseño ya cuadra — sin puntos amarillos ni bajada extra.
 */
function isNoticiasShortPhone(viewportHeight: number, viewportWidth: number): boolean {
  return viewportHeight <= 700 && viewportWidth <= 430;
}

/** Zona muy baja (legado compact). */
function isNoticiasCompactZone(zoneHeight: number, viewportHeight: number): boolean {
  return zoneHeight < 460 || viewportHeight < 620;
}

/**
 * Pixel 7, Galaxy S, iPhone Pro Max, etc.: pantalla alta y ancha estándar.
 */
function isNoticiasTallPhone(
  zoneHeight: number,
  viewportHeight: number,
  viewportWidth: number,
): boolean {
  if (isNoticiasShortPhone(viewportHeight, viewportWidth)) return false;
  if (isNoticiasCompactZone(zoneHeight, viewportHeight)) return false;
  return (
    viewportHeight >= 680 &&
    viewportWidth >= 360 &&
    viewportWidth <= 480 &&
    zoneHeight >= 400
  );
}

function getNavTop(): number {
  const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
  const dock = document.querySelector<HTMLElement>('[data-app-dock]');
  const vv = window.visualViewport;
  const visibleBottom =
    vv != null ? vv.offsetTop + vv.height : window.innerHeight;
  const navTop = navRail?.getBoundingClientRect().top ?? visibleBottom;
  const dockTop = dock?.getBoundingClientRect().top ?? navTop;
  return Math.min(navTop, dockTop, visibleBottom);
}

/** Margen superior para bajar caricatura + monitor en pantallas altas (p. ej. Pixel 7). */
function measureNoticiasOffsetTop(
  screen: HTMLElement,
  zoneHeight: number,
  viewportHeight: number,
): number {
  const body = screen.querySelector<HTMLElement>('.mobile-screen__body');
  const positioner = screen.querySelector<HTMLElement>('.noticias-mobile-stage-positioner');
  const blockEl =
    screen.querySelector<HTMLElement>('.noticias-mobile-stage') ?? positioner;
  if (!body || !blockEl) return 0;

  const bodyRect = body.getBoundingClientRect();
  const blockRect = blockEl.getBoundingClientRect();
  const blockHeight = Math.max(1, blockRect.height);
  const slack = Math.max(0, bodyRect.height - blockHeight);

  const ratio =
    viewportHeight >= 900
      ? 0.54
      : viewportHeight >= 820
        ? 0.5
        : viewportHeight >= 740
          ? 0.46
          : viewportHeight >= 680
            ? 0.42
            : 0.36;
  let offsetTop = Math.round(slack * ratio);

  const minOffset = Math.round(
    Math.min(
      Math.max(zoneHeight * 0.09, 44),
      viewportHeight >= 900 ? 84 : viewportHeight >= 820 ? 72 : viewportHeight >= 740 ? 64 : 56,
    ),
  );
  offsetTop = Math.max(offsetTop, minOffset);

  const tallBoost = Math.round(zoneHeight * 0.04 + Math.min(28, viewportHeight * 0.022));
  offsetTop += tallBoost;

  const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
  const headerBottom = header?.getBoundingClientRect().bottom ?? bodyRect.top;
  const navTop = getNavTop();

  if (positioner) {
    screen.style.setProperty('--noticias-mobile-offset-top', `${offsetTop}px`);
  }

  const blockBottom = blockEl.getBoundingClientRect().bottom;
  const gapNav = navTop - blockBottom;
  if (gapNav < 14 && offsetTop > 10) {
    offsetTop = Math.max(0, offsetTop - Math.ceil(14 - gapNav));
    screen.style.setProperty('--noticias-mobile-offset-top', `${offsetTop}px`);
  }

  const blockTop = blockEl.getBoundingClientRect().top;
  const gapTitle = blockTop - headerBottom;
  if (gapTitle < 6) {
    offsetTop += Math.ceil(6 - gapTitle);
    screen.style.setProperty('--noticias-mobile-offset-top', `${offsetTop}px`);
  }

  return offsetTop;
}

function clearMobileOffsets(screen: HTMLElement): void {
  screen.style.removeProperty('--noticias-mobile-offset-top');
  screen.style.setProperty('--noticias-mobile-translate-y', '0px');
}

type MobileProfile = {
  shortPhone: boolean;
  compactZone: boolean;
  tallPhone: boolean;
};

function resolveMobileProfile(
  zoneHeight: number,
  viewportHeight: number,
  viewportWidth: number,
): MobileProfile {
  const shortPhone = isNoticiasShortPhone(viewportHeight, viewportWidth);
  const compactZone = isNoticiasCompactZone(zoneHeight, viewportHeight);
  const tallPhone = isNoticiasTallPhone(zoneHeight, viewportHeight, viewportWidth);
  return { shortPhone, compactZone, tallPhone };
}

function applyMobileProfile(screen: HTMLElement, profile: MobileProfile): void {
  if (profile.compactZone) {
    screen.setAttribute('data-noticias-compact-zone', 'true');
  } else {
    screen.removeAttribute('data-noticias-compact-zone');
  }

  if (profile.shortPhone || profile.compactZone) {
    screen.setAttribute('data-noticias-hide-dots', 'true');
  } else {
    screen.removeAttribute('data-noticias-hide-dots');
  }

  if (profile.tallPhone) {
    screen.setAttribute('data-noticias-tall-zone', 'true');
    screen.setAttribute('data-noticias-show-swipe-hint', 'true');
  } else {
    screen.removeAttribute('data-noticias-tall-zone');
    screen.removeAttribute('data-noticias-show-swipe-hint');
  }
}

function clearMobileProfile(screen: HTMLElement): void {
  screen.removeAttribute('data-noticias-tall-zone');
  screen.removeAttribute('data-noticias-compact-zone');
  screen.removeAttribute('data-noticias-hide-dots');
  screen.removeAttribute('data-noticias-show-swipe-hint');
}

export function useNoticiasMobileCrtSize(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="noticias"]') ??
      document.querySelector<HTMLElement>('.noticias-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const measure = () => {
      if (desktopMq.matches) {
        screen.style.removeProperty('--noticias-crt-width');
        screen.style.removeProperty('--noticias-crt-aspect');
        screen.style.removeProperty('--noticias-monito-max-height');
        screen.style.removeProperty('--noticias-mobile-unit-scale');
        clearMobileOffsets(screen);
        clearMobileProfile(screen);
        return;
      }

      if (!screen.hasAttribute('data-noticias-layout-ready')) {
        screen.style.removeProperty('--noticias-crt-width');
        screen.style.removeProperty('--noticias-monito-max-height');
        screen.style.removeProperty('--noticias-mobile-unit-scale');
        clearMobileOffsets(screen);
        clearMobileProfile(screen);
        return;
      }

      const zoneVar = getComputedStyle(screen).getPropertyValue('--noticias-mobile-zone-height');
      const zoneHeight = parseFloat(zoneVar) || 0;
      const vv = window.visualViewport;
      const viewportWidth = vv?.width ?? window.innerWidth;
      const viewportHeight = vv?.height ?? window.innerHeight;

      const profile = resolveMobileProfile(zoneHeight, viewportHeight, viewportWidth);
      applyMobileProfile(screen, profile);

      const hideDots = profile.shortPhone || profile.compactZone;
      const monitoH = getMonitoMaxPx(zoneHeight);
      const standPx = hideDots ? STAND_NO_DOTS_PX : STAND_AND_DOTS_PX;
      const availableForUnit = Math.max(160, zoneHeight - monitoH - standPx - STAGE_GAP_PX);

      let width = Math.min(viewportWidth * 0.92, 352);
      const totalUnit = (width - 12) / CRT_ASPECT + BEZEL_CHROME_PX;
      if (totalUnit > availableForUnit) {
        const innerH = Math.max(120, availableForUnit - BEZEL_CHROME_PX);
        width = Math.round(innerH * CRT_ASPECT + 12);
        width = Math.min(width, Math.floor(viewportWidth * 0.92));
        width = Math.max(width, Math.min(248, Math.floor(viewportWidth * 0.88)));
      }

      screen.style.setProperty('--noticias-crt-width', `${width}px`);
      screen.style.setProperty('--noticias-crt-aspect', `${CRT_ASPECT}`);
      screen.style.setProperty('--noticias-monito-max-height', `${Math.round(monitoH)}px`);

      const stage = screen.querySelector<HTMLElement>('.noticias-mobile-stage');
      if (stage && zoneHeight > 0) {
        const maxUnit = Math.max(140, zoneHeight * 0.96);
        const natural = stage.scrollHeight;
        const scale =
          natural > maxUnit ? Math.max(0.72, Math.min(1, (maxUnit / natural) * 0.995)) : 1;
        screen.style.setProperty(
          '--noticias-mobile-unit-scale',
          String(Math.round(scale * 1000) / 1000),
        );
      } else {
        screen.style.setProperty('--noticias-mobile-unit-scale', '1');
      }

      if (profile.tallPhone) {
        measureNoticiasOffsetTop(screen, zoneHeight, viewportHeight);
        requestAnimationFrame(() => {
          measureNoticiasOffsetTop(screen, zoneHeight, viewportHeight);
        });
      } else {
        clearMobileOffsets(screen);
      }
    };

    const stage = screen.querySelector('.noticias-mobile-stage');
    const positioner = screen.querySelector('.noticias-mobile-stage-positioner');
    const body = screen.querySelector('.mobile-screen__body');
    const hint = screen.querySelector('.noticias-mobile-swipe-hint');
    const dock = document.querySelector('[data-app-dock]');

    const cleanup = subscribeMobileLayout(
      () => {
        measure();
        requestAnimationFrame(() => {
          measure();
          requestAnimationFrame(() => measure());
        });
      },
      {
        observe: [screen, body, positioner, stage, hint, dock],
        mediaQueries: [desktopMq],
      },
    );

    return () => {
      cleanup();
      screen.style.removeProperty('--noticias-crt-width');
      screen.style.removeProperty('--noticias-crt-aspect');
      screen.style.removeProperty('--noticias-monito-max-height');
      screen.style.removeProperty('--noticias-mobile-unit-scale');
      clearMobileOffsets(screen);
      clearMobileProfile(screen);
    };
  }, [enabled]);
}
