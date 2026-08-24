import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';
import { measureMobileContentZone } from '@/lib/mobileContentZone';

/**
 * Inicio móvil — misma composición en Android e iOS:
 * logo → eslogan (2px) → espacio → Garantía → espacio → card (llena el hueco) → dots → dock.
 * Escala por alto de zona; no cambia el “look” entre densidades.
 */
const DOCK_CLEARANCE_PX = 4;
const FOOT_FLOOR_PX = 12;
const CAPTION_FLOOR_PX = 36;
const CARD_CHROME_PX = 3;
const BORDER_CLEARANCE_PX = 4;
const STABLE_EPS_PX = 2;

/** Gaps fijos del layout de referencia (captura Inicio). */
const BRAND_GAP_PX = 2;
const SLOGAN_TO_GUARANTEE_PX = 10;
const STAGE_GAP_PX = 10;
const EDGE_GUTTER_PX = 8;
const CARD_WIDTH_RATIO = 0.96;

type Density = 'tight' | 'cozy' | 'roomy';

function densityFor(zoneH: number): Density {
  if (zoneH < 420) return 'tight';
  if (zoneH < 540) return 'cozy';
  return 'roomy';
}

/** Logo ~14% de la zona útil, acotado para que se vea igual en 8 Plus / Pixel / Pro. */
function logoMaxRem(zoneH: number): number {
  const px = Math.round(zoneH * 0.145);
  const rem = px / 16;
  return Math.min(8.5, Math.max(5.75, rem));
}

export function useInicioMobileBoxesZone(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const resolveScreen = () =>
      document.querySelector<HTMLElement>('[data-screen="inicio"]') ??
      document.querySelector<HTMLElement>('.inicio-screen.screen-shell');

    const clearZone = (screen: HTMLElement | null) => {
      if (!screen) return;
      [
        'data-inicio-layout-ready',
        'data-inicio-fill-zone',
        'data-inicio-compact-zone',
        'data-inicio-density',
      ].forEach((a) => screen.removeAttribute(a));
      [
        '--inicio-mobile-boxes-zone-height',
        '--inicio-mobile-edge-gutter',
        '--inicio-mobile-section-gap',
        '--inicio-mobile-card-max-width',
        '--inicio-mobile-card-max-height',
        '--inicio-mobile-hero-max-height',
        '--inicio-home-card-caption-reserve',
        '--inicio-mobile-caption-size',
        '--inicio-mobile-carousel-foot-reserve',
        '--inicio-mobile-carousel-track-height',
        '--inicio-mobile-scroll-page-height',
        '--inicio-mobile-bottom-margin',
        '--inicio-mobile-border-clearance',
        '--inicio-mobile-hover-inset',
        '--inicio-mobile-slide-gap',
        '--inicio-mobile-slide-basis',
        '--inicio-mobile-stage-gap',
        '--inicio-mobile-logo-max-height',
        '--inicio-mobile-body-zone-height',
        '--inicio-mobile-block-offset-top',
        '--inicio-mobile-block-offset-bottom',
        '--inicio-mobile-top-gap',
        '--inicio-mobile-slogan-size',
        '--inicio-mobile-guarantee-scale',
        '--inicio-mobile-foot-gap',
        '--inicio-mobile-rhythm',
        '--inicio-mobile-brand-gap',
        '--inicio-mobile-guarantee-pad-y',
        '--inicio-mobile-guarantee-pad-x',
        '--inicio-mobile-guarantee-title-size',
        '--inicio-mobile-guarantee-lead-size',
        '--inicio-mobile-guarantee-body-size',
        '--inicio-mobile-slogan-to-guarantee',
      ].forEach((p) => screen.style.removeProperty(p));
    };

    const setPx = (screen: HTMLElement, name: string, value: number) => {
      const prev = Number.parseFloat(screen.style.getPropertyValue(name));
      if (Number.isFinite(prev) && Math.abs(prev - value) <= STABLE_EPS_PX) return;
      screen.style.setProperty(name, `${Math.round(value)}px`);
    };

    /** Misma receta visual en todos los teléfonos; solo escala el logo con la zona. */
    const applySharedTokens = (screen: HTMLElement, zoneH: number, W: number) => {
      const cardMaxWidth = Math.round(
        Math.min(W - EDGE_GUTTER_PX * 2, Math.round(W * CARD_WIDTH_RATIO)),
      );
      const logoRem = logoMaxRem(zoneH);

      screen.style.setProperty('--inicio-mobile-logo-max-height', `${logoRem.toFixed(2)}rem`);
      screen.style.setProperty('--inicio-mobile-slogan-size', '0.65rem');
      screen.style.setProperty('--inicio-mobile-stage-gap', `${STAGE_GAP_PX}px`);
      screen.style.setProperty('--inicio-mobile-top-gap', '0px');
      screen.style.setProperty('--inicio-mobile-brand-gap', `${BRAND_GAP_PX}px`);
      screen.style.setProperty('--inicio-mobile-slogan-to-guarantee', `${SLOGAN_TO_GUARANTEE_PX}px`);
      screen.style.setProperty('--inicio-mobile-foot-gap', '2px');
      screen.style.setProperty('--inicio-mobile-caption-size', '14px');
      screen.style.setProperty('--inicio-mobile-guarantee-pad-y', '0.22rem');
      screen.style.setProperty('--inicio-mobile-guarantee-pad-x', '0.5rem');
      screen.style.setProperty('--inicio-mobile-guarantee-title-size', '0.52rem');
      screen.style.setProperty('--inicio-mobile-guarantee-lead-size', '0.65rem');
      screen.style.setProperty('--inicio-mobile-guarantee-body-size', '0.575rem');
      screen.style.setProperty('--inicio-mobile-border-clearance', `${BORDER_CLEARANCE_PX}px`);
      screen.style.setProperty('--inicio-mobile-hover-inset', '2px');
      screen.style.setProperty('--inicio-mobile-slide-gap', '0px');
      screen.style.setProperty('--inicio-mobile-slide-basis', '100%');
      screen.style.setProperty('--inicio-mobile-guarantee-scale', '1');
      screen.style.setProperty('--inicio-mobile-block-offset-top', '0px');
      screen.style.setProperty('--inicio-mobile-block-offset-bottom', '0px');
      screen.style.setProperty('--inicio-mobile-rhythm', `${STAGE_GAP_PX}px`);

      return { edgeGutter: EDGE_GUTTER_PX, cardMaxWidth };
    };

    const measure = () => {
      const screen = resolveScreen();
      if (desktopMq.matches) {
        clearZone(screen);
        return;
      }
      if (!screen?.querySelector('.inicio-mobile-top')) return;

      const zone = measureMobileContentZone(screen, { dockClearancePx: DOCK_CLEARANCE_PX });
      if (!zone || zone.zoneHeight < 160) return;

      const H = zone.zoneHeight;
      const W = zone.viewportW;
      const density = densityFor(H);

      screen.setAttribute('data-inicio-fill-zone', 'true');
      screen.setAttribute('data-inicio-density', density);
      if (density === 'tight') screen.setAttribute('data-inicio-compact-zone', 'true');
      else screen.removeAttribute('data-inicio-compact-zone');

      const { edgeGutter, cardMaxWidth } = applySharedTokens(screen, H, W);

      const topEl = screen.querySelector<HTMLElement>('.inicio-mobile-top');
      const footEl = screen.querySelector<HTMLElement>('.inicio-mobile-carousel-foot');
      const captionEl = screen.querySelector<HTMLElement>(
        '.inicio-mobile-slide__inner .inicio-home-card__caption--slide-out',
      );

      const topH = topEl ? Math.ceil(topEl.getBoundingClientRect().height) : 0;
      const footH = Math.max(
        FOOT_FLOOR_PX,
        footEl ? Math.ceil(footEl.getBoundingClientRect().height) + 1 : 0,
      );
      const captionH = captionEl
        ? Math.ceil(captionEl.getBoundingClientRect().height)
        : CAPTION_FLOOR_PX;
      const captionReserve = Math.max(CAPTION_FLOOR_PX, captionH + 4);

      /* Card llena el hueco Garantía → dots/dock (misma idea en todos los phones). */
      const availableCard = Math.max(180, H - topH - footH - STAGE_GAP_PX);
      const cardMax = availableCard;
      const roomForHero = Math.max(150, cardMax - captionReserve - CARD_CHROME_PX);
      const heroMax = roomForHero;
      const track = cardMax;
      const zoneSpan = Math.max(160, H - topH - STAGE_GAP_PX);

      setPx(screen, '--inicio-mobile-body-zone-height', H);
      setPx(screen, '--inicio-mobile-boxes-zone-height', zoneSpan);
      setPx(screen, '--inicio-mobile-carousel-track-height', track);
      setPx(screen, '--inicio-mobile-scroll-page-height', track);
      setPx(screen, '--inicio-mobile-edge-gutter', edgeGutter);
      setPx(screen, '--inicio-mobile-section-gap', STAGE_GAP_PX);
      setPx(screen, '--inicio-mobile-card-max-width', cardMaxWidth);
      setPx(screen, '--inicio-mobile-card-max-height', cardMax);
      setPx(screen, '--inicio-mobile-hero-max-height', heroMax);
      setPx(screen, '--inicio-home-card-caption-reserve', captionReserve);
      setPx(screen, '--inicio-mobile-carousel-foot-reserve', footH);
      setPx(screen, '--inicio-mobile-bottom-margin', footH);

      screen.setAttribute('data-inicio-layout-ready', 'true');
    };

    const runMeasure = () => {
      measure();
      requestAnimationFrame(() => measure());
    };

    const screen = resolveScreen();
    const header = screen?.querySelector('.mobile-screen__header');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');

    return subscribeMobileLayout(runMeasure, {
      observe: [screen, header, navRail, dock].filter(Boolean) as Element[],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
