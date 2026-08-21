import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';
import { measureMobileContentZone } from '@/lib/mobileContentZone';

const DOCK_CLEARANCE_PX = 10;
const FOOT_FLOOR_PX = 28;
const CAPTION_FLOOR_PX = 56;
const CARD_CHROME_PX = 8;
const BORDER_CLEARANCE_PX = 4;
const BOTTOM_EDGE_PX = 3;
const STABLE_EPS_PX = 2;

/**
 * Inicio móvil: reparte el alto útil del dispositivo (header→dock)
 * en ritmo + cabecera + card + dots, sin apilar con márgenes negativos.
 */
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
      /* 0 = teléfono bajo / zona corta → 1 = alto cómodo */
      const fill = Math.max(0, Math.min(1, (H - 380) / 280));
      const isCompact = H < 460;

      /* Ritmo vertical que crece con el teléfono (no gaps de 2–4px). */
      const rhythm = Math.round(8 + fill * 8);
      const brandGap = Math.round(4 + fill * 6);
      const stageGap = rhythm;
      const topInnerGap = Math.round(6 + fill * 6);

      const edgeGutter = Math.max(8, Math.min(14, Math.round(W * 0.03)));
      const cardMaxWidth = Math.round(
        Math.max(280, Math.min(W - edgeGutter * 2, Math.round(W * 0.94))),
      );

      const logoMaxRem = Number((4.6 + fill * 2.2).toFixed(2));
      const sloganSizeRem = Number((0.7 + fill * 0.1).toFixed(3));
      const captionPx = Math.round(14 + fill * 3);

      const gPadY = Number((0.4 + fill * 0.25).toFixed(3));
      const gPadX = Number((0.65 + fill * 0.2).toFixed(3));
      const gTitle = Number((0.625 + fill * 0.05).toFixed(3));
      const gLead = Number((0.72 + fill * 0.1).toFixed(3));
      const gBody = Number((0.625 + fill * 0.08).toFixed(3));

      screen.setAttribute('data-inicio-fill-zone', 'true');
      if (isCompact) screen.setAttribute('data-inicio-compact-zone', 'true');
      else screen.removeAttribute('data-inicio-compact-zone');

      screen.style.setProperty('--inicio-mobile-logo-max-height', `${logoMaxRem}rem`);
      screen.style.setProperty('--inicio-mobile-slogan-size', `${sloganSizeRem}rem`);
      screen.style.setProperty('--inicio-mobile-rhythm', `${rhythm}px`);
      screen.style.setProperty('--inicio-mobile-brand-gap', `${brandGap}px`);
      screen.style.setProperty('--inicio-mobile-stage-gap', `${stageGap}px`);
      screen.style.setProperty('--inicio-mobile-top-gap', `${topInnerGap}px`);
      screen.style.setProperty('--inicio-mobile-foot-gap', `${Math.round(4 + fill * 4)}px`);
      screen.style.setProperty('--inicio-mobile-border-clearance', `${BORDER_CLEARANCE_PX}px`);
      screen.style.setProperty('--inicio-mobile-hover-inset', '2px');
      screen.style.setProperty('--inicio-mobile-caption-size', `${captionPx}px`);
      screen.style.setProperty('--inicio-mobile-guarantee-pad-y', `${gPadY}rem`);
      screen.style.setProperty('--inicio-mobile-guarantee-pad-x', `${gPadX}rem`);
      screen.style.setProperty('--inicio-mobile-guarantee-title-size', `${gTitle}rem`);
      screen.style.setProperty('--inicio-mobile-guarantee-lead-size', `${gLead}rem`);
      screen.style.setProperty('--inicio-mobile-guarantee-body-size', `${gBody}rem`);
      screen.style.setProperty('--inicio-mobile-slide-gap', '0px');
      screen.style.setProperty('--inicio-mobile-slide-basis', '100%');
      screen.style.setProperty('--inicio-mobile-block-offset-top', '0px');
      screen.style.setProperty('--inicio-mobile-block-offset-bottom', '0px');
      /* Sin scale: el texto respira con tamaños, no se aplasta. */
      screen.style.setProperty('--inicio-mobile-guarantee-scale', '1');

      const topEl = screen.querySelector<HTMLElement>('.inicio-mobile-top');
      const footEl = screen.querySelector<HTMLElement>('.inicio-mobile-carousel-foot');
      const captionEl = screen.querySelector<HTMLElement>(
        '.inicio-mobile-slide__inner .inicio-home-card__caption--slide-out',
      );

      const topH = topEl ? Math.ceil(topEl.getBoundingClientRect().height) : 0;
      const footH = Math.max(
        FOOT_FLOOR_PX,
        footEl ? Math.ceil(footEl.getBoundingClientRect().height) : 0,
      );
      const captionH = captionEl
        ? Math.ceil(captionEl.getBoundingClientRect().height)
        : CAPTION_FLOOR_PX;
      const captionReserve = Math.max(CAPTION_FLOOR_PX, captionH + 10);

      const overhead = stageGap + topInnerGap;
      const availableCard = Math.max(160, H - topH - footH - overhead);

      /* Héroe = lo que queda tras reservar caption; crece en móviles altos. */
      let heroMax = Math.max(140, availableCard - captionReserve - CARD_CHROME_PX);
      /* Tope suave ~52% del viewport para no comerse logo+garantía en pantallas altas. */
      const heroCap = Math.round(Math.min(cardMaxWidth * 1.05, zone.viewportH * 0.52));
      heroMax = Math.min(heroMax, heroCap);
      /* En zonas altas, no dejar el héroe demasiado tímido. */
      if (fill > 0.35) {
        heroMax = Math.max(heroMax, Math.round(200 + fill * 80));
        heroMax = Math.min(heroMax, availableCard - captionReserve - CARD_CHROME_PX);
      }

      let cardMax = Math.min(
        availableCard,
        heroMax + captionReserve + CARD_CHROME_PX,
      );

      if (finalPass && topH > 0) {
        /* Si la cabecera se pasó del presupuesto (~34% H), bajar un poco logo. */
        const topBudget = Math.round(H * (0.3 + fill * 0.06));
        if (topH > topBudget + 8 && logoMaxRem > 4.4) {
          const nextLogo = Math.max(4.4, logoMaxRem - 0.45);
          screen.style.setProperty('--inicio-mobile-logo-max-height', `${nextLogo.toFixed(2)}rem`);
          const topH2 = topEl ? Math.ceil(topEl.getBoundingClientRect().height) : topH;
          const avail2 = Math.max(160, H - topH2 - footH - overhead);
          heroMax = Math.min(heroCap, Math.max(140, avail2 - captionReserve - CARD_CHROME_PX));
          cardMax = Math.min(avail2, heroMax + captionReserve + CARD_CHROME_PX);
        }
      }

      const track = cardMax + BOTTOM_EDGE_PX + BORDER_CLEARANCE_PX;
      const zoneSpan = Math.max(160, H - topH - stageGap);

      setPx(screen, '--inicio-mobile-body-zone-height', H);
      setPx(screen, '--inicio-mobile-boxes-zone-height', zoneSpan);
      setPx(screen, '--inicio-mobile-carousel-track-height', track);
      setPx(screen, '--inicio-mobile-scroll-page-height', track);
      setPx(screen, '--inicio-mobile-edge-gutter', edgeGutter);
      setPx(screen, '--inicio-mobile-section-gap', rhythm);
      setPx(screen, '--inicio-mobile-card-max-width', cardMaxWidth);
      setPx(screen, '--inicio-mobile-card-max-height', cardMax);
      setPx(screen, '--inicio-mobile-hero-max-height', heroMax);
      setPx(screen, '--inicio-home-card-caption-reserve', captionReserve);
      setPx(screen, '--inicio-mobile-carousel-foot-reserve', footH);
      setPx(screen, '--inicio-mobile-bottom-margin', footH);

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
