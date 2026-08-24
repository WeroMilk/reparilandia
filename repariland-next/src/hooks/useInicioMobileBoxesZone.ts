import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';
import { measureMobileContentZone } from '@/lib/mobileContentZone';

/**
 * Inicio móvil:
 * - Zona útil = header → tope del dock (los circulos no tapan fotos/dots).
 * - El hueco entre Garantía y el rectángulo se usa para ESTIRAR la card.
 * - Dots quedan justo bajo la card, sobre el dock.
 */
const DOCK_CLEARANCE_PX = 2;
const FOOT_FLOOR_PX = 10;
const CAPTION_FLOOR_PX = 36;
const CARD_CHROME_PX = 3;
const BORDER_CLEARANCE_PX = 4;
const BOTTOM_EDGE_PX = 3;
const STABLE_EPS_PX = 2;

type Density = 'tight' | 'cozy' | 'roomy';

function densityFor(zoneH: number): Density {
  if (zoneH < 420) return 'tight';
  if (zoneH < 540) return 'cozy';
  return 'roomy';
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
      ].forEach((p) => screen.style.removeProperty(p));
    };

    const setPx = (screen: HTMLElement, name: string, value: number) => {
      const prev = Number.parseFloat(screen.style.getPropertyValue(name));
      if (Number.isFinite(prev) && Math.abs(prev - value) <= STABLE_EPS_PX) return;
      screen.style.setProperty(name, `${Math.round(value)}px`);
    };

    const applyDensityTokens = (screen: HTMLElement, density: Density, W: number) => {
      const edgeGutter = density === 'tight' ? 6 : density === 'cozy' ? 8 : 10;
      const cardMaxWidth = Math.round(
        Math.min(W - edgeGutter * 2, Math.round(W * (density === 'tight' ? 0.96 : 0.97))),
      );

      if (density === 'tight') {
        screen.style.setProperty('--inicio-mobile-logo-max-height', '6.25rem');
        screen.style.setProperty('--inicio-mobile-slogan-size', '0.6rem');
        screen.style.setProperty('--inicio-mobile-stage-gap', '3px');
        screen.style.setProperty('--inicio-mobile-top-gap', '3px');
        screen.style.setProperty('--inicio-mobile-brand-gap', '2px');
        screen.style.setProperty('--inicio-mobile-foot-gap', '3px');
        screen.style.setProperty('--inicio-mobile-caption-size', '13px');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-y', '0.18rem');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-x', '0.4rem');
        screen.style.setProperty('--inicio-mobile-guarantee-title-size', '0.48rem');
        screen.style.setProperty('--inicio-mobile-guarantee-lead-size', '0.6rem');
        screen.style.setProperty('--inicio-mobile-guarantee-body-size', '0.55rem');
      } else if (density === 'cozy') {
        screen.style.setProperty('--inicio-mobile-logo-max-height', '7.75rem');
        screen.style.setProperty('--inicio-mobile-slogan-size', '0.65rem');
        screen.style.setProperty('--inicio-mobile-stage-gap', '4px');
        screen.style.setProperty('--inicio-mobile-top-gap', '4px');
        screen.style.setProperty('--inicio-mobile-brand-gap', '3px');
        screen.style.setProperty('--inicio-mobile-foot-gap', '4px');
        screen.style.setProperty('--inicio-mobile-caption-size', '14px');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-y', '0.22rem');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-x', '0.5rem');
        screen.style.setProperty('--inicio-mobile-guarantee-title-size', '0.52rem');
        screen.style.setProperty('--inicio-mobile-guarantee-lead-size', '0.65rem');
        screen.style.setProperty('--inicio-mobile-guarantee-body-size', '0.575rem');
      } else {
        screen.style.setProperty('--inicio-mobile-logo-max-height', '9.25rem');
        screen.style.setProperty('--inicio-mobile-slogan-size', '0.7rem');
        screen.style.setProperty('--inicio-mobile-stage-gap', '5px');
        screen.style.setProperty('--inicio-mobile-top-gap', '5px');
        screen.style.setProperty('--inicio-mobile-brand-gap', '4px');
        screen.style.setProperty('--inicio-mobile-foot-gap', '4px');
        screen.style.setProperty('--inicio-mobile-caption-size', '14px');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-y', '0.25rem');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-x', '0.55rem');
        screen.style.setProperty('--inicio-mobile-guarantee-title-size', '0.54rem');
        screen.style.setProperty('--inicio-mobile-guarantee-lead-size', '0.68rem');
        screen.style.setProperty('--inicio-mobile-guarantee-body-size', '0.6rem');
      }

      screen.style.setProperty('--inicio-mobile-border-clearance', `${BORDER_CLEARANCE_PX}px`);
      screen.style.setProperty('--inicio-mobile-hover-inset', '2px');
      screen.style.setProperty('--inicio-mobile-slide-gap', '0px');
      screen.style.setProperty('--inicio-mobile-slide-basis', '100%');
      screen.style.setProperty('--inicio-mobile-guarantee-scale', '1');
      screen.style.setProperty('--inicio-mobile-block-offset-top', '0px');
      screen.style.setProperty('--inicio-mobile-block-offset-bottom', '0px');
      screen.style.setProperty(
        '--inicio-mobile-rhythm',
        screen.style.getPropertyValue('--inicio-mobile-stage-gap'),
      );

      return { edgeGutter, cardMaxWidth };
    };

    const measure = (finalPass = false) => {
      const screen = resolveScreen();
      if (desktopMq.matches) {
        clearZone(screen);
        return;
      }
      if (!screen?.querySelector('.inicio-mobile-top')) return;

      /* Clearance extra: dots + caption nunca bajo los circulos de color. */
      const zone = measureMobileContentZone(screen, { dockClearancePx: DOCK_CLEARANCE_PX });
      if (!zone || zone.zoneHeight < 160) return;

      const H = zone.zoneHeight;
      const W = zone.viewportW;
      const density = densityFor(H);

      screen.setAttribute('data-inicio-fill-zone', 'true');
      screen.setAttribute('data-inicio-density', density);
      if (density === 'tight') screen.setAttribute('data-inicio-compact-zone', 'true');
      else screen.removeAttribute('data-inicio-compact-zone');

      const { edgeGutter, cardMaxWidth } = applyDensityTokens(screen, density, W);

      const topEl = screen.querySelector<HTMLElement>('.inicio-mobile-top');
      const footEl = screen.querySelector<HTMLElement>('.inicio-mobile-carousel-foot');
      const captionEl = screen.querySelector<HTMLElement>(
        '.inicio-mobile-slide__inner .inicio-home-card__caption--slide-out',
      );

      const stageGap = Number.parseFloat(screen.style.getPropertyValue('--inicio-mobile-stage-gap')) || 4;

      let topH = topEl ? Math.ceil(topEl.getBoundingClientRect().height) : 0;
      const footH = Math.max(
        FOOT_FLOOR_PX,
        footEl ? Math.ceil(footEl.getBoundingClientRect().height) + 1 : 0,
      );
      const captionH = captionEl
        ? Math.ceil(captionEl.getBoundingClientRect().height)
        : CAPTION_FLOOR_PX;
      const captionReserve = Math.max(
        density === 'tight' ? 36 : CAPTION_FLOOR_PX,
        captionH + (density === 'tight' ? 2 : 4),
      );

      const topBudget = Math.round(H * (density === 'tight' ? 0.36 : density === 'cozy' ? 0.38 : 0.42));
      if (finalPass && topEl && topH > topBudget + 4) {
        const logoNow =
          Number.parseFloat(screen.style.getPropertyValue('--inicio-mobile-logo-max-height')) || 6.25;
        const floor = density === 'tight' ? 5.5 : density === 'cozy' ? 6.75 : 8;
        screen.style.setProperty(
          '--inicio-mobile-logo-max-height',
          `${Math.max(floor, logoNow - 0.3).toFixed(2)}rem`,
        );
        topH = Math.ceil(topEl.getBoundingClientRect().height);
      }

      const overhead = Math.max(0, stageGap);
      /* Usar todo el hueco bajo logo/garantía hasta los dots/dock (+ boost ligero). */
      const availableCard = Math.max(190, H - topH - footH - overhead + 8);
      const cardMax = availableCard;
      const roomForHero = Math.max(160, cardMax - captionReserve - CARD_CHROME_PX);
      const heroMax = roomForHero;
      const track = cardMax;

      const zoneSpan = Math.max(160, H - topH - stageGap);

      setPx(screen, '--inicio-mobile-body-zone-height', H);
      setPx(screen, '--inicio-mobile-boxes-zone-height', zoneSpan);
      setPx(screen, '--inicio-mobile-carousel-track-height', track);
      setPx(screen, '--inicio-mobile-scroll-page-height', track);
      setPx(screen, '--inicio-mobile-edge-gutter', edgeGutter);
      setPx(screen, '--inicio-mobile-section-gap', stageGap);
      setPx(screen, '--inicio-mobile-card-max-width', cardMaxWidth);
      setPx(screen, '--inicio-mobile-card-max-height', cardMax);
      setPx(screen, '--inicio-mobile-hero-max-height', heroMax);
      setPx(screen, '--inicio-home-card-caption-reserve', captionReserve);
      setPx(screen, '--inicio-mobile-carousel-foot-reserve', footH);
      setPx(screen, '--inicio-mobile-bottom-margin', footH);

      void cardMaxWidth;
      screen.setAttribute('data-inicio-layout-ready', 'true');
    };

    const runMeasure = () => {
      measure(false);
      requestAnimationFrame(() => measure(true));
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
