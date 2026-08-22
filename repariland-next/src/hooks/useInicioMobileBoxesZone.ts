import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';
import { measureMobileContentZone } from '@/lib/mobileContentZone';

/**
 * Diseño UX Inicio (móvil) — calibrado con iPhone 8 Plus (~414×736, zona útil ~340–420)
 * y escala a Pro/Max.
 *
 * Jerarquía: marca → confianza breve → RECTÁNGULO (foto+caption) → dots.
 * El héroe es el protagonista (~48–56% de la zona).
 */
const DOCK_CLEARANCE_PX = 8;
const FOOT_FLOOR_PX = 26;
const CAPTION_FLOOR_PX = 48;
const CARD_CHROME_PX = 6;
const BORDER_CLEARANCE_PX = 4;
const BOTTOM_EDGE_PX = 3;
const STABLE_EPS_PX = 2;

type Density = 'tight' | 'cozy' | 'roomy';

function densityFor(zoneH: number): Density {
  if (zoneH < 400) return 'tight'; /* 8 Plus / SE con Safari chrome */
  if (zoneH < 520) return 'cozy';
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
      const edgeGutter = density === 'tight' ? 10 : density === 'cozy' ? 12 : 14;
      const cardMaxWidth = Math.round(
        Math.min(W - edgeGutter * 2, Math.round(W * (density === 'tight' ? 0.92 : 0.94))),
      );

      if (density === 'tight') {
        /* iPhone 8 Plus: marca chica, confianza corta, héroe grande */
        screen.style.setProperty('--inicio-mobile-logo-max-height', '3.65rem');
        screen.style.setProperty('--inicio-mobile-slogan-size', '0.625rem');
        screen.style.setProperty('--inicio-mobile-stage-gap', '6px');
        screen.style.setProperty('--inicio-mobile-top-gap', '5px');
        screen.style.setProperty('--inicio-mobile-brand-gap', '2px');
        screen.style.setProperty('--inicio-mobile-foot-gap', '4px');
        screen.style.setProperty('--inicio-mobile-caption-size', '13px');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-y', '0.35rem');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-x', '0.55rem');
        screen.style.setProperty('--inicio-mobile-guarantee-title-size', '0.5625rem');
        screen.style.setProperty('--inicio-mobile-guarantee-lead-size', '0.6875rem');
        screen.style.setProperty('--inicio-mobile-guarantee-body-size', '0.625rem');
      } else if (density === 'cozy') {
        screen.style.setProperty('--inicio-mobile-logo-max-height', '4.75rem');
        screen.style.setProperty('--inicio-mobile-slogan-size', '0.7rem');
        screen.style.setProperty('--inicio-mobile-stage-gap', '8px');
        screen.style.setProperty('--inicio-mobile-top-gap', '7px');
        screen.style.setProperty('--inicio-mobile-brand-gap', '4px');
        screen.style.setProperty('--inicio-mobile-foot-gap', '6px');
        screen.style.setProperty('--inicio-mobile-caption-size', '14px');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-y', '0.45rem');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-x', '0.7rem');
        screen.style.setProperty('--inicio-mobile-guarantee-title-size', '0.6rem');
        screen.style.setProperty('--inicio-mobile-guarantee-lead-size', '0.75rem');
        screen.style.setProperty('--inicio-mobile-guarantee-body-size', '0.65rem');
      } else {
        screen.style.setProperty('--inicio-mobile-logo-max-height', '6rem');
        screen.style.setProperty('--inicio-mobile-slogan-size', '0.78rem');
        screen.style.setProperty('--inicio-mobile-stage-gap', '12px');
        screen.style.setProperty('--inicio-mobile-top-gap', '10px');
        screen.style.setProperty('--inicio-mobile-brand-gap', '6px');
        screen.style.setProperty('--inicio-mobile-foot-gap', '8px');
        screen.style.setProperty('--inicio-mobile-caption-size', '15px');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-y', '0.55rem');
        screen.style.setProperty('--inicio-mobile-guarantee-pad-x', '0.85rem');
        screen.style.setProperty('--inicio-mobile-guarantee-title-size', '0.65rem');
        screen.style.setProperty('--inicio-mobile-guarantee-lead-size', '0.8125rem');
        screen.style.setProperty('--inicio-mobile-guarantee-body-size', '0.7rem');
      }

      screen.style.setProperty('--inicio-mobile-border-clearance', `${BORDER_CLEARANCE_PX}px`);
      screen.style.setProperty('--inicio-mobile-hover-inset', '2px');
      screen.style.setProperty('--inicio-mobile-slide-gap', '0px');
      screen.style.setProperty('--inicio-mobile-slide-basis', '100%');
      screen.style.setProperty('--inicio-mobile-guarantee-scale', '1');
      screen.style.setProperty('--inicio-mobile-block-offset-top', '0px');
      screen.style.setProperty('--inicio-mobile-block-offset-bottom', '0px');
      screen.style.setProperty('--inicio-mobile-rhythm', screen.style.getPropertyValue('--inicio-mobile-stage-gap'));

      return { edgeGutter, cardMaxWidth };
    };

    const measure = (finalPass = false) => {
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

      const { edgeGutter, cardMaxWidth } = applyDensityTokens(screen, density, W);

      const topEl = screen.querySelector<HTMLElement>('.inicio-mobile-top');
      const footEl = screen.querySelector<HTMLElement>('.inicio-mobile-carousel-foot');
      const captionEl = screen.querySelector<HTMLElement>(
        '.inicio-mobile-slide__inner .inicio-home-card__caption--slide-out',
      );

      const stageGap = Number.parseFloat(screen.style.getPropertyValue('--inicio-mobile-stage-gap')) || 8;
      const topInnerGap = Number.parseFloat(screen.style.getPropertyValue('--inicio-mobile-top-gap')) || 6;

      let topH = topEl ? Math.ceil(topEl.getBoundingClientRect().height) : 0;
      const footH = Math.max(
        FOOT_FLOOR_PX,
        footEl ? Math.ceil(footEl.getBoundingClientRect().height) : 0,
      );
      const captionH = captionEl
        ? Math.ceil(captionEl.getBoundingClientRect().height)
        : CAPTION_FLOOR_PX;
      const captionReserve = Math.max(
        density === 'tight' ? 44 : CAPTION_FLOOR_PX,
        captionH + (density === 'tight' ? 6 : 10),
      );

      /* Presupuesto: el héroe debe ser el bloque dominante. */
      const heroShare = density === 'tight' ? 0.52 : density === 'cozy' ? 0.48 : 0.46;
      const topBudgetShare = density === 'tight' ? 0.28 : density === 'cozy' ? 0.32 : 0.34;
      const overhead = stageGap + 2;
      const topBudget = Math.round(H * topBudgetShare);

      if (finalPass && topEl && topH > topBudget + 6) {
        /* Recortar logo un poco más si la cabecera se come al héroe. */
        const logoNow = Number.parseFloat(screen.style.getPropertyValue('--inicio-mobile-logo-max-height')) || 4;
        const nextLogo = Math.max(density === 'tight' ? 3.1 : 3.8, logoNow - 0.4);
        screen.style.setProperty('--inicio-mobile-logo-max-height', `${nextLogo.toFixed(2)}rem`);
        topH = Math.ceil(topEl.getBoundingClientRect().height);
      }

      const availableCard = Math.max(150, H - topH - footH - overhead);
      const targetHero = Math.round(H * heroShare);
      const roomForHero = Math.max(120, availableCard - captionReserve - CARD_CHROME_PX);
      const heroFloor = density === 'tight' ? 155 : 175;
      let heroMax = Math.min(
        roomForHero,
        Math.max(targetHero, heroFloor),
        Math.round(cardMaxWidth * (density === 'tight' ? 0.78 : 0.88)),
      );
      heroMax = Math.max(120, Math.min(heroMax, roomForHero));

      const cardMax = Math.min(
        availableCard,
        heroMax + captionReserve + CARD_CHROME_PX,
      );

      const track = cardMax + BOTTOM_EDGE_PX + BORDER_CLEARANCE_PX;
      const zoneSpan = Math.max(150, H - topH - stageGap);

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

      void topInnerGap;
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
