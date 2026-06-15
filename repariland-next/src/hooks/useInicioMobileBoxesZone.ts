import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const DOCK_CLEARANCE_PX = 28;
const CAROUSEL_FOOT_FLOOR_PX = 34;
const CAROUSEL_ROW_GAP_PX = 6;
const CAPTION_RESERVE_PX = 44;
const CARD_MIN_HEIGHT_PX = 88;
const BOTTOM_BOX_MARGIN_PX = 12;
const HOVER_HALO_INSET_FILL_PX = 4;
const TALL_VIEWPORT_MIN_PX = 620;
const TALL_VIEWPORT_RANGE_PX = 320;
const TALL_ZONE_MIN_PX = 240;
const TALL_ZONE_RANGE_PX = 220;
const TALL_MIN_BOTTOM_PX = 4;
const SHORT_VIEWPORT_PX = 760;
const SHORT_BODY_ZONE_PX = 540;
const SLIDE_BASIS_PERCENT = 100;
const SLIDE_GAP_PX = 0;
const LOGO_BASE_REM = 6.5;
const LOGO_TALL_BOOST_REM = 2.5;
const LOGO_COMPACT_CAP_REM = 5.25;
const SLACK_TO_CAROUSEL = 0.97;
const SLACK_TO_LOGO = 0.02;
const LOGO_SLACK_CAP_REM = 1.5;

function mobileTallFillFactor(viewportH: number, zoneSpan: number): number {
  const byViewport = Math.max(
    0,
    Math.min(1, (viewportH - TALL_VIEWPORT_MIN_PX) / TALL_VIEWPORT_RANGE_PX),
  );
  const byZone = Math.max(0, Math.min(1, (zoneSpan - TALL_ZONE_MIN_PX) / TALL_ZONE_RANGE_PX));
  return Math.max(byViewport, byZone);
}

/**
 * Zona del carrusel de boxes en Inicio (móvil): rellena entre cabecera y dock en pantallas altas.
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
      screen.removeAttribute('data-inicio-layout-ready');
      screen.removeAttribute('data-inicio-fill-zone');
      screen.removeAttribute('data-inicio-compact-zone');
      screen.style.removeProperty('--inicio-mobile-boxes-zone-height');
      screen.style.removeProperty('--inicio-mobile-edge-gutter');
      screen.style.removeProperty('--inicio-mobile-section-gap');
      screen.style.removeProperty('--inicio-mobile-card-max-width');
      screen.style.removeProperty('--inicio-mobile-card-max-height');
      screen.style.removeProperty('--inicio-mobile-hero-max-height');
      screen.style.removeProperty('--inicio-home-card-caption-reserve');
      screen.style.removeProperty('--inicio-mobile-carousel-foot-reserve');
      screen.style.removeProperty('--inicio-mobile-carousel-track-height');
      screen.style.removeProperty('--inicio-mobile-scroll-page-height');
      screen.style.removeProperty('--inicio-mobile-bottom-margin');
      screen.style.removeProperty('--inicio-mobile-hover-inset');
      screen.style.removeProperty('--inicio-mobile-slide-gap');
      screen.style.removeProperty('--inicio-mobile-slide-basis');
      screen.style.removeProperty('--inicio-mobile-stage-gap');
      screen.style.removeProperty('--inicio-mobile-logo-max-height');
      screen.style.removeProperty('--inicio-mobile-body-zone-height');
      screen.style.removeProperty('--inicio-mobile-block-offset-top');
      screen.style.removeProperty('--inicio-mobile-block-offset-bottom');
      screen.style.removeProperty('--inicio-mobile-top-gap');
      screen.style.removeProperty('--inicio-mobile-slogan-size');
      screen.style.removeProperty('--inicio-mobile-guarantee-scale');
    };

    const measure = (finalPass = false) => {
      const screen = resolveScreen();
      if (desktopMq.matches) {
        clearZone(screen);
        return;
      }

      const topBlock = screen?.querySelector<HTMLElement>('.inicio-mobile-top');
      const header = screen?.querySelector<HTMLElement>('.mobile-screen__header');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      const dock = document.querySelector<HTMLElement>('[data-app-dock]');
      if (!screen || !topBlock || !navRail) {
        clearZone(screen);
        return;
      }

      const headerBottom = header?.getBoundingClientRect().bottom ?? topBlock.getBoundingClientRect().top;
      const navTop = navRail.getBoundingClientRect().top;
      const dockTop = dock?.getBoundingClientRect().top ?? navTop;
      const vv = window.visualViewport;
      const visibleBottom =
        vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      const visibleNavTop = Math.min(navTop, dockTop, visibleBottom) - DOCK_CLEARANCE_PX;
      let bodyZoneHeight = Math.max(0, Math.round(visibleNavTop - headerBottom));
      const viewportH = Math.round(vv != null ? vv.height : window.innerHeight);
      const viewportW = Math.round(vv != null ? vv.width : window.innerWidth);
      const tallFill = mobileTallFillFactor(viewportH, bodyZoneHeight);
      const isCompact =
        viewportH <= SHORT_VIEWPORT_PX || bodyZoneHeight <= SHORT_BODY_ZONE_PX;

      const bottomMargin = Math.round(
        isCompact ? 6 + tallFill * 4 : BOTTOM_BOX_MARGIN_PX + tallFill * 6,
      );
      const stageGap = Math.round(isCompact ? 2 + tallFill * 2 : 3 + tallFill * 4);
      const topGap = Math.round(isCompact ? 0 : 2 + tallFill * 2);
      const hoverInset = HOVER_HALO_INSET_FILL_PX;

      const edgeGutter = Math.max(10, Math.min(16, Math.round(viewportW * 0.032)));
      const sectionGap = Math.max(6, Math.min(12, Math.round(viewportW * 0.024 + tallFill * 3)));
      const cardMaxWidth = Math.round(Math.max(240, viewportW - edgeGutter * 2));

      const scrollFoot = screen.querySelector<HTMLElement>('.inicio-mobile-carousel-foot');
      const footHeight = Math.max(
        CAROUSEL_FOOT_FLOOR_PX,
        scrollFoot ? Math.ceil(scrollFoot.getBoundingClientRect().height) : 0,
      );

      const caption = screen.querySelector<HTMLElement>(
        '.inicio-home-card--mobile-carousel .inicio-home-card__caption',
      );
      const captionHeight = caption
        ? Math.ceil(caption.getBoundingClientRect().height)
        : CAPTION_RESERVE_PX;
      const captionReserve = Math.max(CAPTION_RESERVE_PX, captionHeight + 8);

      let logoMaxRem = isCompact
        ? LOGO_COMPACT_CAP_REM
        : LOGO_BASE_REM + tallFill * LOGO_TALL_BOOST_REM;
      let guaranteeScale = isCompact ? 0.88 : 0.94 + tallFill * 0.08;
      let sloganSizeRem = isCompact ? 0.68 : 0.72 + tallFill * 0.12;

      screen.setAttribute('data-inicio-fill-zone', 'true');
      if (isCompact) {
        screen.setAttribute('data-inicio-compact-zone', 'true');
      } else {
        screen.removeAttribute('data-inicio-compact-zone');
      }

      screen.style.setProperty('--inicio-mobile-logo-max-height', `${logoMaxRem.toFixed(2)}rem`);
      screen.style.setProperty('--inicio-mobile-slogan-size', `${sloganSizeRem.toFixed(3)}rem`);
      screen.style.setProperty('--inicio-mobile-guarantee-scale', guaranteeScale.toFixed(3));
      screen.style.setProperty('--inicio-mobile-top-gap', `${topGap}px`);
      screen.style.setProperty('--inicio-mobile-stage-gap', `${stageGap}px`);
      screen.style.setProperty('--inicio-mobile-bottom-margin', `${bottomMargin}px`);
      screen.style.setProperty('--inicio-mobile-hover-inset', `${hoverInset}px`);

      if (finalPass) {
        const body = screen.querySelector<HTMLElement>('.mobile-screen__body');
        const bodyHeight = body ? Math.floor(body.getBoundingClientRect().height) : 0;
        if (bodyHeight > 0) {
          bodyZoneHeight = Math.max(bodyZoneHeight, bodyHeight);
        }
      }

      const topEl = screen.querySelector<HTMLElement>('.inicio-mobile-top');
      const footEl = screen.querySelector<HTMLElement>('.inicio-mobile-carousel-foot');
      const measureTopHeight = () =>
        topEl ? Math.ceil(topEl.getBoundingClientRect().height) : 0;
      const measureFootHeight = () =>
        Math.max(
          CAROUSEL_FOOT_FLOOR_PX,
          footEl ? Math.ceil(footEl.getBoundingClientRect().height) : footHeight,
        );

      let topH = measureTopHeight();
      let footH = measureFootHeight();

      const carouselOverhead =
        stageGap + topGap + TALL_MIN_BOTTOM_PX + hoverInset * 2 + bottomMargin + CAROUSEL_ROW_GAP_PX;

      const fitCarousel = () =>
        Math.max(
          CARD_MIN_HEIGHT_PX,
          bodyZoneHeight - topH - footH - carouselOverhead,
        );

      let cardMaxHeight = fitCarousel();

      if (finalPass) {
        let guard = 0;
        while (cardMaxHeight < CARD_MIN_HEIGHT_PX + 24 && logoMaxRem > 4.25 && guard < 6) {
          logoMaxRem = Math.max(4.25, logoMaxRem - 0.65);
          guaranteeScale = Math.max(0.78, guaranteeScale - 0.05);
          sloganSizeRem = Math.max(0.62, sloganSizeRem - 0.04);
          screen.style.setProperty('--inicio-mobile-logo-max-height', `${logoMaxRem.toFixed(2)}rem`);
          screen.style.setProperty('--inicio-mobile-slogan-size', `${sloganSizeRem.toFixed(3)}rem`);
          screen.style.setProperty('--inicio-mobile-guarantee-scale', guaranteeScale.toFixed(3));
          topH = measureTopHeight();
          cardMaxHeight = fitCarousel();
          guard += 1;
        }

        const slack = Math.max(0, cardMaxHeight - CARD_MIN_HEIGHT_PX);
        if (!isCompact && slack > 8) {
          const logoBoost = Math.min(LOGO_SLACK_CAP_REM, slack * SLACK_TO_LOGO / 16);
          if (logoBoost > 0) {
            logoMaxRem += logoBoost;
            screen.style.setProperty('--inicio-mobile-logo-max-height', `${logoMaxRem.toFixed(2)}rem`);
            topH = measureTopHeight();
            cardMaxHeight = fitCarousel();
          }
        }

        if (cardMaxHeight > CARD_MIN_HEIGHT_PX) {
          const slackAfterFit = Math.max(
            0,
            bodyZoneHeight - topH - footH - carouselOverhead - cardMaxHeight,
          );
          if (slackAfterFit > 2) {
            cardMaxHeight += slackAfterFit * SLACK_TO_CAROUSEL;
          }
        }

        footH = measureFootHeight();
        cardMaxHeight = Math.max(
          CARD_MIN_HEIGHT_PX,
          Math.min(cardMaxHeight, bodyZoneHeight - topH - footH - carouselOverhead),
        );

        screen.style.setProperty('--inicio-mobile-block-offset-top', '0px');
        screen.style.setProperty('--inicio-mobile-block-offset-bottom', `${TALL_MIN_BOTTOM_PX}px`);
      }

      const zoneSpan = Math.max(
        CARD_MIN_HEIGHT_PX,
        bodyZoneHeight - topH - stageGap - topGap - TALL_MIN_BOTTOM_PX,
      );
      const trackHeight = Math.max(CARD_MIN_HEIGHT_PX, zoneSpan - footH - CAROUSEL_ROW_GAP_PX);
      const heroMaxHeight = Math.max(52, cardMaxHeight - captionReserve);
      const finalTrack = cardMaxHeight + bottomMargin;

      screen.style.setProperty('--inicio-mobile-boxes-zone-height', `${zoneSpan}px`);
      screen.style.setProperty('--inicio-mobile-body-zone-height', `${bodyZoneHeight}px`);
      screen.style.setProperty('--inicio-mobile-carousel-track-height', `${finalTrack}px`);
      screen.style.setProperty('--inicio-mobile-scroll-page-height', `${finalTrack}px`);
      screen.style.setProperty('--inicio-mobile-edge-gutter', `${edgeGutter}px`);
      screen.style.setProperty('--inicio-mobile-section-gap', `${sectionGap}px`);
      screen.style.setProperty('--inicio-mobile-card-max-width', `${cardMaxWidth}px`);
      screen.style.setProperty('--inicio-mobile-card-max-height', `${cardMaxHeight}px`);
      screen.style.setProperty('--inicio-mobile-hero-max-height', `${heroMaxHeight}px`);
      screen.style.setProperty('--inicio-home-card-caption-reserve', `${captionReserve}px`);
      screen.style.setProperty('--inicio-mobile-carousel-foot-reserve', `${footH}px`);
      screen.style.setProperty('--inicio-mobile-slide-gap', `${SLIDE_GAP_PX}px`);
      screen.style.setProperty('--inicio-mobile-slide-basis', `${SLIDE_BASIS_PERCENT}%`);

      screen.setAttribute('data-inicio-layout-ready', 'true');
    };

    const runMeasure = () => {
      measure(false);
      requestAnimationFrame(() => {
        measure(true);
        requestAnimationFrame(() => {
          measure(true);
          requestAnimationFrame(() => measure(true));
        });
      });
    };

    const screen = resolveScreen();
    const stage = screen?.querySelector('.inicio-mobile-stage');
    const header = screen?.querySelector('.mobile-screen__header');
    const body = screen?.querySelector('.mobile-screen__body');
    const topBlock = screen?.querySelector('.inicio-mobile-top');
    const guarantee = screen?.querySelector('.inicio-mobile-guarantee');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');
    const scrollBox = screen?.querySelector('.inicio-mobile-carousel');
    const scrollViewport = screen?.querySelector('.inicio-mobile-embla');
    const scrollFoot = screen?.querySelector('.inicio-mobile-carousel-foot');
    const centerBlock = screen?.querySelector('.inicio-mobile-center-block');

    return subscribeMobileLayout(runMeasure, {
      observe: [
        screen,
        stage,
        header,
        body,
        topBlock,
        guarantee,
        navRail,
        dock,
        scrollBox,
        scrollViewport,
        centerBlock,
        scrollFoot,
      ].filter(Boolean) as Element[],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
