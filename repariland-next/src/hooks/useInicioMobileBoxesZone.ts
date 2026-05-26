import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const DOCK_CLEARANCE_PX = 22;
const CAROUSEL_FOOT_FLOOR_PX = 34;
const CAROUSEL_ROW_GAP_PX = 8;
const CAPTION_RESERVE_PX = 44;
const CARD_MIN_HEIGHT_PX = 96;
const BOTTOM_BOX_MARGIN_PX = 28;
const HOVER_HALO_INSET_PX = 10;
const CARD_HEIGHT_SCALE = 0.82;
const CARD_HEIGHT_SCALE_TALL = 1;
const TALL_VIEWPORT_MIN_PX = 680;
const TALL_VIEWPORT_RANGE_PX = 200;
const TALL_ZONE_MIN_PX = 260;
const TALL_ZONE_RANGE_PX = 180;
const TALL_FILL_THRESHOLD = 0.08;
const TALL_MIN_BOTTOM_PX = 4;
const SHORT_VIEWPORT_PX = 700;
const SLIDE_BASIS_PERCENT = 100;
const SLIDE_GAP_PX = 0;
const CARD_WIDTH_SCALE = 0.92;
const LOGO_BASE_REM = 6.15;
const LOGO_TALL_BOOST_REM = 4.25;

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

    const screen =
      document.querySelector<HTMLElement>('[data-screen="inicio"]') ??
      document.querySelector<HTMLElement>('.inicio-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const clearZone = () => {
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
    };

    const measure = (finalPass = false) => {
      if (desktopMq.matches) {
        clearZone();
        return;
      }

      const topBlock = screen.querySelector<HTMLElement>('.inicio-mobile-top');
      const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      const dock = document.querySelector<HTMLElement>('[data-app-dock]');
      if (!topBlock || !navRail) {
        clearZone();
        return;
      }

      const headerBottom = header?.getBoundingClientRect().bottom ?? topBlock.getBoundingClientRect().top;
      const zoneTop = topBlock.getBoundingClientRect().bottom;
      const navTop = navRail.getBoundingClientRect().top;
      const dockTop = dock?.getBoundingClientRect().top ?? navTop;
      const vv = window.visualViewport;
      const visibleBottom =
        vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      const visibleNavTop = Math.min(navTop, dockTop, visibleBottom) - DOCK_CLEARANCE_PX;
      const zoneSpan = Math.max(0, Math.round(visibleNavTop - zoneTop));
      let bodyZoneHeight = Math.max(0, Math.round(visibleNavTop - headerBottom));
      const viewportH = Math.round(vv != null ? vv.height : window.innerHeight);
      const viewportW = Math.round(vv != null ? vv.width : window.innerWidth);
      const tallFill = mobileTallFillFactor(viewportH, bodyZoneHeight);
      const useFillZone = tallFill >= TALL_FILL_THRESHOLD || viewportH >= TALL_VIEWPORT_MIN_PX;

      const cardHeightScale =
        CARD_HEIGHT_SCALE + tallFill * (CARD_HEIGHT_SCALE_TALL - CARD_HEIGHT_SCALE);
      const bottomMargin = Math.round(
        useFillZone ? 4 + tallFill * 8 : BOTTOM_BOX_MARGIN_PX + tallFill * 4,
      );
      const stageGap = Math.round(useFillZone ? 4 + tallFill * 10 : tallFill * 18);

      const edgeGutter = Math.max(14, Math.min(22, Math.round(viewportW * 0.045)));
      const sectionGap = Math.max(8, Math.min(14, Math.round(viewportW * 0.028)));
      const cardMaxWidth = Math.round(
        Math.max(232, (viewportW - edgeGutter * 2) * CARD_WIDTH_SCALE),
      );

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

      const hoverInset = HOVER_HALO_INSET_PX;
      const trackHeight = Math.max(
        CARD_MIN_HEIGHT_PX,
        zoneSpan - footHeight - CAROUSEL_ROW_GAP_PX,
      );
      let cardMaxHeight = Math.max(
        CARD_MIN_HEIGHT_PX,
        Math.round((trackHeight - hoverInset * 2 - bottomMargin) * cardHeightScale),
      );
      let heroMaxHeight = Math.max(56, cardMaxHeight - captionReserve);
      let logoMaxRem = LOGO_BASE_REM + tallFill * LOGO_TALL_BOOST_REM;

      if (useFillZone) {
        screen.setAttribute('data-inicio-fill-zone', 'true');
        screen.removeAttribute('data-inicio-compact-zone');
      } else {
        screen.removeAttribute('data-inicio-fill-zone');
        if (viewportH <= SHORT_VIEWPORT_PX || viewportW <= 430) {
          screen.setAttribute('data-inicio-compact-zone', 'true');
        } else {
          screen.removeAttribute('data-inicio-compact-zone');
        }
        screen.style.removeProperty('--inicio-mobile-block-offset-top');
        screen.style.removeProperty('--inicio-mobile-block-offset-bottom');
      }

      if (finalPass) {
        const body = screen.querySelector<HTMLElement>('.mobile-screen__body');
        const bodyHeight = body ? Math.floor(body.getBoundingClientRect().height) : 0;
        if (bodyHeight > 0) {
          bodyZoneHeight = Math.max(bodyZoneHeight, bodyHeight);
        }
      }

      if (finalPass && useFillZone) {
        const topEl = screen.querySelector<HTMLElement>('.inicio-mobile-top');
        const footEl = screen.querySelector<HTMLElement>('.inicio-mobile-carousel-foot');
        const topH = topEl ? Math.ceil(topEl.getBoundingClientRect().height) : 0;
        const footH = footEl
          ? Math.ceil(footEl.getBoundingClientRect().height)
          : footHeight;

        const expandedTrack = Math.max(
          CARD_MIN_HEIGHT_PX,
          bodyZoneHeight - topH - footH - stageGap - TALL_MIN_BOTTOM_PX - hoverInset * 2,
        );
        cardMaxHeight = Math.max(
          cardMaxHeight,
          expandedTrack - bottomMargin,
        );
        heroMaxHeight = Math.max(56, cardMaxHeight - captionReserve);

        screen.style.setProperty('--inicio-mobile-carousel-track-height', `${expandedTrack}px`);
        screen.style.setProperty('--inicio-mobile-scroll-page-height', `${expandedTrack}px`);
        screen.style.setProperty('--inicio-mobile-block-offset-top', '0px');
        screen.style.setProperty('--inicio-mobile-block-offset-bottom', `${TALL_MIN_BOTTOM_PX}px`);

        const blockUsed =
          topH +
          stageGap +
          TALL_MIN_BOTTOM_PX +
          hoverInset * 2 +
          expandedTrack +
          footH;
        let remainingSlack = Math.max(0, bodyZoneHeight - blockUsed);

        if (remainingSlack > 8) {
          const logoBoostRem = Math.min(3.5, remainingSlack / 42);
          logoMaxRem += logoBoostRem;
          remainingSlack -= Math.round(logoBoostRem * 42);
        }

        if (remainingSlack > 4) {
          cardMaxHeight += remainingSlack;
          heroMaxHeight = Math.max(56, cardMaxHeight - captionReserve);
          const expandedTrackWithSlack = cardMaxHeight + bottomMargin;
          screen.style.setProperty(
            '--inicio-mobile-carousel-track-height',
            `${expandedTrackWithSlack}px`,
          );
          screen.style.setProperty(
            '--inicio-mobile-scroll-page-height',
            `${expandedTrackWithSlack}px`,
          );
        }
      }

      screen.style.setProperty('--inicio-mobile-boxes-zone-height', `${zoneSpan}px`);
      screen.style.setProperty('--inicio-mobile-body-zone-height', `${bodyZoneHeight}px`);
      if (!finalPass || !useFillZone) {
        screen.style.setProperty('--inicio-mobile-carousel-track-height', `${trackHeight}px`);
        screen.style.setProperty('--inicio-mobile-scroll-page-height', `${trackHeight}px`);
      }
      screen.style.setProperty('--inicio-mobile-bottom-margin', `${bottomMargin}px`);
      screen.style.setProperty('--inicio-mobile-stage-gap', `${stageGap}px`);
      screen.style.setProperty('--inicio-mobile-logo-max-height', `${logoMaxRem.toFixed(2)}rem`);
      screen.style.setProperty('--inicio-mobile-edge-gutter', `${edgeGutter}px`);
      screen.style.setProperty('--inicio-mobile-section-gap', `${sectionGap}px`);
      screen.style.setProperty('--inicio-mobile-card-max-width', `${cardMaxWidth}px`);
      screen.style.setProperty('--inicio-mobile-card-max-height', `${cardMaxHeight}px`);
      screen.style.setProperty('--inicio-mobile-hero-max-height', `${heroMaxHeight}px`);
      screen.style.setProperty('--inicio-home-card-caption-reserve', `${captionReserve}px`);
      screen.style.setProperty('--inicio-mobile-carousel-foot-reserve', `${footHeight}px`);
      screen.style.setProperty('--inicio-mobile-hover-inset', `${hoverInset}px`);
      screen.style.setProperty('--inicio-mobile-slide-gap', `${SLIDE_GAP_PX}px`);
      screen.style.setProperty('--inicio-mobile-slide-basis', `${SLIDE_BASIS_PERCENT}%`);

      screen.setAttribute('data-inicio-layout-ready', 'true');
    };

    const stage = screen.querySelector('.inicio-mobile-stage');
    const header = screen.querySelector('.mobile-screen__header');
    const body = screen.querySelector('.mobile-screen__body');
    const topBlock = screen.querySelector('.inicio-mobile-top');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');
    const scrollBox = screen.querySelector('.inicio-mobile-carousel');
    const scrollViewport = screen.querySelector('.inicio-mobile-embla');
    const scrollFoot = screen.querySelector('.inicio-mobile-carousel-foot');
    const centerBlock = screen.querySelector('.inicio-mobile-center-block');

    const runMeasure = () => {
      measure(false);
      requestAnimationFrame(() => {
        measure(true);
        requestAnimationFrame(() => measure(true));
      });
    };

    return subscribeMobileLayout(runMeasure, {
      observe: [
        screen,
        stage,
        header,
        body,
        topBlock,
        navRail,
        dock,
        scrollBox,
        scrollViewport,
        centerBlock,
        scrollFoot,
      ],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
