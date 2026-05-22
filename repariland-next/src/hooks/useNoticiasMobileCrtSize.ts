import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

/** Pantalla CRT: más ancha que alta (5:4) — evita estiramiento vertical en móvil. */
const CRT_ASPECT = 5 / 4;
/** Estimación conservadora (marco + etiqueta CRT) para que no se recorte el monitor. */
const BEZEL_CHROME_PX = 92;
/** Base + cuello + puntos (valores reales suelen superar 76px). */
const STAND_AND_DOTS_PX = 100;
const STAND_NO_DOTS_PX = 58;
const ZONE_SAFETY_PX = 16;
/** ring-2 + sombra + padding del stage — margen derecho visible en todos los móviles. */
const HORIZONTAL_GUTTER_PX = 28;
const CRT_MAX_WIDTH_PX = 480;

function isNoticiasShortPhone(viewportHeight: number, viewportWidth: number): boolean {
  return viewportHeight <= 700 && viewportWidth <= 430;
}

function isNoticiasCompactZone(zoneHeight: number, viewportHeight: number): boolean {
  return zoneHeight < 460 || viewportHeight < 620;
}

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

function monitorMarginBottom(profile: MobileProfile, zoneHeight: number): number {
  if (profile.compactZone || profile.shortPhone) {
    return Math.round(Math.min(14, Math.max(6, zoneHeight * 0.022)));
  }
  if (profile.tallPhone) {
    return Math.round(Math.min(40, Math.max(14, zoneHeight * 0.04 + 6)));
  }
  return Math.round(Math.min(28, Math.max(10, zoneHeight * 0.034 + 4)));
}

/** Altura total del bloque CRT (pantalla + marco + base) a partir del ancho. */
function estimateCrtBlockHeight(width: number, standPx: number, monitorMb: number): number {
  const screenH = Math.max(0, (width - 12) / CRT_ASPECT);
  return screenH + BEZEL_CHROME_PX + standPx + monitorMb;
}

function setNumVar(screen: HTMLElement, name: string, value: number, unit = 'px'): boolean {
  const raw = getComputedStyle(screen).getPropertyValue(name).trim();
  const prev = parseFloat(raw) || 0;
  const next = Math.round(value * 1000) / 1000;
  if (Math.abs(prev - next) < (unit === 'px' ? 1 : 0.01)) return false;
  screen.style.setProperty(name, unit === 'px' ? `${Math.round(next)}px` : String(next));
  return true;
}

function getContentMaxWidth(screen: HTMLElement, viewportWidth: number): number {
  const positioner = screen.querySelector<HTMLElement>('.noticias-mobile-stage-positioner');
  const body = screen.querySelector<HTMLElement>('.mobile-screen__body');
  const ref = positioner ?? body;
  if (ref && ref.clientWidth > 0) {
    return Math.max(160, ref.clientWidth - HORIZONTAL_GUTTER_PX);
  }
  const vv = window.visualViewport;
  const vw = vv?.width ?? viewportWidth;
  const pad =
    body != null
      ? parseFloat(getComputedStyle(body).paddingLeft) +
        parseFloat(getComputedStyle(body).paddingRight)
      : 12;
  return Math.max(160, Math.floor(vw - pad - HORIZONTAL_GUTTER_PX));
}

function fitNoticiasCrtWidth(
  zoneHeight: number,
  maxWidthPx: number,
  profile: MobileProfile,
  standPx: number,
  hintH: number,
  monitorMb: number,
): number {
  const available = Math.max(
    120,
    zoneHeight - standPx - hintH - monitorMb - ZONE_SAFETY_PX,
  );
  const maxW = maxWidthPx;
  const minW = Math.min(200, Math.floor(maxWidthPx * 0.82));

  let width = Math.min(
    Math.round((available - BEZEL_CHROME_PX) * CRT_ASPECT + 12),
    maxW,
    CRT_MAX_WIDTH_PX,
  );
  width = Math.max(width, minW);

  while (width > minW && estimateCrtBlockHeight(width, standPx, monitorMb) > available) {
    width -= 2;
  }

  return width;
}

/** Una sola pasada tras pintar: si el bloque real aún no cabe, reduce ancho (sin bucle). */
function verifyNoticiasCrtFits(
  screen: HTMLElement,
  zoneHeight: number,
  hintH: number,
  minW: number,
): number | null {
  const monitorCol = screen.querySelector<HTMLElement>('.noticias-mobile-monitor-col');
  if (!monitorCol || zoneHeight <= 0) return null;

  const avail = zoneHeight - hintH - ZONE_SAFETY_PX;
  const blockH = monitorCol.getBoundingClientRect().height;
  if (blockH <= avail) return null;

  const currentWidth =
    parseFloat(getComputedStyle(screen).getPropertyValue('--noticias-crt-width')) || 0;
  if (currentWidth <= 0) return null;

  const ratio = (avail - 6) / blockH;
  const next = Math.max(minW, Math.floor(currentWidth * ratio * 0.985));
  return next < currentWidth - 1 ? next : null;
}

function verifyNoticiasCrtHorizontal(
  screen: HTMLElement,
  minW: number,
): number | null {
  const bezel = screen.querySelector<HTMLElement>('.noticias-crt-bezel');
  const container =
    screen.querySelector<HTMLElement>('.noticias-mobile-stage-positioner') ??
    screen.querySelector<HTMLElement>('.mobile-screen__body');
  if (!bezel || !container) return null;

  const b = bezel.getBoundingClientRect();
  const c = container.getBoundingClientRect();
  const overflowRight = b.right - (c.right - 4);
  const overflowLeft = c.left + 4 - b.left;
  const overflow = Math.max(overflowRight, overflowLeft);
  if (overflow <= 1) return null;

  const currentWidth =
    parseFloat(getComputedStyle(screen).getPropertyValue('--noticias-crt-width')) || 0;
  if (currentWidth <= 0) return null;

  const next = Math.max(minW, Math.floor(currentWidth - overflow - 6));
  return next < currentWidth - 1 ? next : null;
}

export function useNoticiasMobileCrtSize(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="noticias"]') ??
      document.querySelector<HTMLElement>('.noticias-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');
    let lastSignature = '';
    let verifyToken = '';

    const measure = () => {
      if (desktopMq.matches) {
        screen.style.removeProperty('--noticias-crt-width');
        screen.style.removeProperty('--noticias-crt-aspect');
        screen.style.removeProperty('--noticias-monito-max-height');
        screen.style.removeProperty('--noticias-mobile-unit-scale');
        clearMobileOffsets(screen);
        screen.style.removeProperty('--noticias-mobile-monitor-mb');
        clearMobileProfile(screen);
        lastSignature = '';
        return;
      }

      if (!screen.hasAttribute('data-noticias-layout-ready')) {
        screen.style.removeProperty('--noticias-crt-width');
        screen.style.removeProperty('--noticias-monito-max-height');
        screen.style.removeProperty('--noticias-mobile-unit-scale');
        clearMobileOffsets(screen);
        screen.style.removeProperty('--noticias-mobile-monitor-mb');
        clearMobileProfile(screen);
        lastSignature = '';
        return;
      }

      const zoneHeight =
        parseFloat(
          getComputedStyle(screen).getPropertyValue('--noticias-mobile-zone-height'),
        ) || 0;
      const vv = window.visualViewport;
      const viewportWidth = Math.round(vv?.width ?? window.innerWidth);
      const viewportHeight = Math.round(vv?.height ?? window.innerHeight);

      const profile = resolveMobileProfile(zoneHeight, viewportHeight, viewportWidth);
      const monitorMb = monitorMarginBottom(profile, zoneHeight);
      const hideDots = profile.shortPhone || profile.compactZone;
      const standPx = hideDots ? STAND_NO_DOTS_PX : STAND_AND_DOTS_PX;
      const hintEl = screen.querySelector<HTMLElement>('.noticias-mobile-swipe-hint');
      const hintVisible =
        profile.tallPhone &&
        hintEl != null &&
        getComputedStyle(hintEl).display !== 'none';
      let hintH = hintVisible && hintEl ? Math.ceil(hintEl.getBoundingClientRect().height) : 0;
      if (hintVisible && hintH < 24) hintH = 44;
      const contentMaxW = getContentMaxWidth(screen, viewportWidth);
      const minW = Math.min(200, Math.floor(contentMaxW * 0.82));

      const signature = [
        zoneHeight,
        viewportWidth,
        viewportHeight,
        contentMaxW,
        profile.compactZone ? 1 : 0,
        profile.shortPhone ? 1 : 0,
        profile.tallPhone ? 1 : 0,
        hintH,
      ].join('|');

      if (signature === lastSignature) return;
      lastSignature = signature;
      verifyToken = '';

      applyMobileProfile(screen, profile);

      const width = fitNoticiasCrtWidth(
        zoneHeight,
        contentMaxW,
        profile,
        standPx,
        hintH,
        monitorMb,
      );

      setNumVar(screen, '--noticias-mobile-monitor-mb', monitorMb);
      setNumVar(screen, '--noticias-crt-width', width);
      screen.style.setProperty('--noticias-crt-aspect', String(CRT_ASPECT));
      screen.style.removeProperty('--noticias-monito-max-height');
      screen.style.setProperty('--noticias-mobile-unit-scale', '1');
      screen.style.setProperty('--noticias-mobile-translate-y', '0px');

      if (verifyToken !== signature) {
        verifyToken = signature;
        requestAnimationFrame(() => {
          if (lastSignature !== signature) return;
          let fitted = verifyNoticiasCrtFits(screen, zoneHeight, hintH, minW);
          if (fitted != null) {
            setNumVar(screen, '--noticias-crt-width', fitted);
          }
          const fittedX = verifyNoticiasCrtHorizontal(screen, minW);
          if (fittedX != null) {
            setNumVar(screen, '--noticias-crt-width', fittedX);
          }
        });
      }
    };

    const body = screen.querySelector('.mobile-screen__body');
    const header = screen.querySelector('.mobile-screen__header');
    const dock = document.querySelector('[data-app-dock]');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');

    const cleanup = subscribeMobileLayout(measure, {
      observe: [screen, body, header, navRail, dock],
      mediaQueries: [desktopMq],
    });

    return () => {
      cleanup();
      lastSignature = '';
      screen.style.removeProperty('--noticias-crt-width');
      screen.style.removeProperty('--noticias-crt-aspect');
      screen.style.removeProperty('--noticias-monito-max-height');
      screen.style.removeProperty('--noticias-mobile-unit-scale');
      clearMobileOffsets(screen);
      screen.style.removeProperty('--noticias-mobile-monitor-mb');
      clearMobileProfile(screen);
    };
  }, [enabled]);
}
