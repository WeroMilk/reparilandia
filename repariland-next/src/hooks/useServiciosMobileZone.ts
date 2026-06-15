import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const DOCK_CLEARANCE_PX = 14;
const STAGE_GAP_PX = 8;
const ICON_STACK_GAP_PX = 10;
const ICON_STACK_GAP_MAX_PX = 18;
const ICON_SIZE_MIN_PX = 26;
const ICON_SIZE_MAX_PX = 38;
const ICON_ROW_FIRST = 6;
const ICON_ROW_SECOND = 5;
const ICON_ROWS = 2;
const ICON_GRID_PAD_PX = 8;
const ICON_ROW_GAP_PX = 5;
const DOTS_RESERVE_PX = 22;
const CARD_MIN_PX = 128;
const CARD_FOOTER_FALLBACK_PX = 80;
const ICON_SIZE_MAX_TALL_PX = 46;
const TALL_VIEWPORT_MIN_PX = 680;
const TALL_VIEWPORT_RANGE_PX = 200;
const TALL_ZONE_MIN_PX = 340;
const TALL_ZONE_RANGE_PX = 200;
const TALL_FILL_THRESHOLD = 0.12;
const SHORT_VIEWPORT_PX = 740;
const SHORT_VIEWPORT_RANGE_PX = 160;
const SHORT_ZONE_PX = 520;
const SHORT_ZONE_RANGE_PX = 140;
const COMPACT_THRESHOLD = 0.08;
const MIN_BOTTOM_PX = 10;
const ICON_SIZE_MIN_COMPACT_PX = 24;
const HERO_MAX_PX_COMPACT = 132;

function mobileTallFillFactor(viewportH: number, zoneHeight: number): number {
  const byViewport = Math.max(
    0,
    Math.min(1, (viewportH - TALL_VIEWPORT_MIN_PX) / TALL_VIEWPORT_RANGE_PX),
  );
  const byZone = Math.max(0, Math.min(1, (zoneHeight - TALL_ZONE_MIN_PX) / TALL_ZONE_RANGE_PX));
  return Math.max(byViewport, byZone);
}

function mobileCompactFactor(viewportH: number, zoneHeight: number): number {
  const byViewport = Math.max(
    0,
    Math.min(1, (SHORT_VIEWPORT_PX - viewportH) / SHORT_VIEWPORT_RANGE_PX),
  );
  const byZone = Math.max(0, Math.min(1, (SHORT_ZONE_PX - zoneHeight) / SHORT_ZONE_RANGE_PX));
  return Math.max(byViewport, byZone);
}

/**
 * Altura de la zona útil en Servicios (móvil): intro + tarjeta + rejilla 6+5 iconos + puntos.
 * Rellena el espacio entre título y dock sin huecos.
 */
export function useServiciosMobileZone(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="servicios"]') ??
      document.querySelector<HTMLElement>('.servicios-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const clear = () => {
      screen.removeAttribute('data-servicios-layout-ready');
      screen.removeAttribute('data-servicios-fill-zone');
      screen.removeAttribute('data-servicios-compact-zone');
      screen.removeAttribute('data-servicios-small-zone');
      screen.style.removeProperty('--servicios-mobile-zone-height');
      screen.style.removeProperty('--servicios-mobile-intro-height');
      screen.style.removeProperty('--servicios-mobile-paginator-height');
      screen.style.removeProperty('--servicios-mobile-paginator-reserve');
      screen.style.removeProperty('--servicios-mobile-card-max-height');
      screen.style.removeProperty('--servicios-mobile-carousel-zone-height');
      screen.style.removeProperty('--servicios-mobile-hero-max-height');
      screen.style.removeProperty('--servicios-mobile-icon-size');
      screen.style.removeProperty('--servicios-mobile-icon-gap');
      screen.style.removeProperty('--servicios-mobile-icon-stack-gap');
      screen.style.removeProperty('--servicios-mobile-stack-height');
      screen.style.removeProperty('--servicios-mobile-intro-push');
      screen.style.removeProperty('--servicios-mobile-spacer-height');
      screen.style.removeProperty('--servicios-mobile-block-offset-top');
      screen.style.removeProperty('--servicios-mobile-block-offset-bottom');
      screen.style.removeProperty('--servicios-mobile-stage-pull-up');
      screen.style.removeProperty('--servicios-mobile-stage-gap');
    };

    const estimatePaginatorHeight = (iconSize: number, gap: number) =>
      iconSize * ICON_ROWS +
      ICON_ROW_GAP_PX +
      ICON_GRID_PAD_PX +
      DOTS_RESERVE_PX +
      gap;

    const measureIconSize = (
      gridWidth: number,
      gap: number,
      verticalBudget: number,
      iconSizeMax: number,
      iconMinPx: number,
    ) => {
      const iconFromRowFirst = Math.floor((gridWidth - gap * (ICON_ROW_FIRST - 1)) / ICON_ROW_FIRST);
      const iconFromRowSecond = Math.floor((gridWidth - gap * (ICON_ROW_SECOND - 1)) / ICON_ROW_SECOND);
      const iconFromWidth = Math.min(iconFromRowFirst, iconFromRowSecond);
      const iconFromHeight = Math.floor(
        (verticalBudget - ICON_GRID_PAD_PX - ICON_ROW_GAP_PX - DOTS_RESERVE_PX) / ICON_ROWS,
      );
      return Math.max(iconMinPx, Math.min(iconFromWidth, iconFromHeight, iconSizeMax));
    };

    const measureFooterReserve = () => {
      const cta = screen.querySelector<HTMLElement>(
        '.servicios-mobile-slide .servicios-slide-cta',
      );
      const desc = screen.querySelector<HTMLElement>(
        '.servicios-mobile-slide .servicios-slide-desc',
      );
      const ctaH = cta ? Math.ceil(cta.getBoundingClientRect().height) : 0;
      const descH = desc ? Math.ceil(desc.getBoundingClientRect().height) : 0;
      return Math.max(CARD_FOOTER_FALLBACK_PX, ctaH + descH + 10);
    };

    const measureZoneSpan = () => {
      const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      const dock = document.querySelector<HTMLElement>('[data-app-dock]');
      if (!header || !navRail) return null;

      const headerBottom = header.getBoundingClientRect().bottom;
      const navTop = navRail.getBoundingClientRect().top;
      const dockTop = dock?.getBoundingClientRect().top ?? navTop;
      const vv = window.visualViewport;
      const visibleBottom =
        vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      const visibleNavTop = Math.min(navTop, dockTop, visibleBottom) - DOCK_CLEARANCE_PX;
      const measuredSpan = Math.max(0, Math.round(visibleNavTop - headerBottom));
      const body = screen.querySelector<HTMLElement>('.mobile-screen__body');
      const bodyHeight = body ? Math.floor(body.getBoundingClientRect().height) : 0;
      return {
        zoneHeight: Math.max(measuredSpan, bodyHeight),
        viewportH: Math.round(vv?.height ?? window.innerHeight),
        viewportW: Math.round(vv?.width ?? window.innerWidth),
      };
    };

    const applyLayout = (finalPass: boolean) => {
      if (desktopMq.matches) {
        clear();
        return;
      }

      const zoneMetrics = measureZoneSpan();
      if (!zoneMetrics) {
        clear();
        return;
      }

      let { zoneHeight, viewportH, viewportW } = zoneMetrics;
      const tallFill = mobileTallFillFactor(viewportH, zoneHeight);
      const compactFill = mobileCompactFactor(viewportH, zoneHeight);
      const iconMinPx =
        compactFill >= COMPACT_THRESHOLD ? ICON_SIZE_MIN_COMPACT_PX : ICON_SIZE_MIN_PX;
      const iconSizeMax =
        ICON_SIZE_MAX_PX + Math.round(tallFill * (ICON_SIZE_MAX_TALL_PX - ICON_SIZE_MAX_PX));

      const isSmallMobile =
        tallFill < TALL_FILL_THRESHOLD &&
        (compactFill >= COMPACT_THRESHOLD ||
          viewportH <= SHORT_VIEWPORT_PX ||
          zoneHeight <= SHORT_ZONE_PX);

      if (isSmallMobile) {
        screen.setAttribute('data-servicios-compact-zone', 'true');
        screen.setAttribute('data-servicios-small-zone', 'true');
        screen.style.setProperty(
          '--servicios-mobile-spacer-height',
          `${Math.max(4, Math.round(6 * (1 - compactFill * 0.5)))}px`,
        );
        screen.style.setProperty(
          '--servicios-mobile-stage-pull-up',
          `${Math.round(2 + compactFill * 6)}px`,
        );
      } else {
        screen.removeAttribute('data-servicios-compact-zone');
        screen.removeAttribute('data-servicios-small-zone');
        screen.style.setProperty('--servicios-mobile-spacer-height', '0px');
        screen.style.removeProperty('--servicios-mobile-stage-pull-up');
      }

      screen.setAttribute('data-servicios-fill-zone', 'true');
      screen.style.setProperty(
        '--servicios-mobile-stage-gap',
        tallFill >= TALL_FILL_THRESHOLD
          ? `${Math.round(8 + tallFill * 10)}px`
          : `${Math.round(6 + compactFill * 6)}px`,
      );

      const intro = screen.querySelector<HTMLElement>('.servicios-mobile-intro');
      const paginator = screen.querySelector<HTMLElement>('.servicios-mobile-paginator');
      const gridEl = screen.querySelector<HTMLElement>('.servicios-mobile-icon-grid');

      const gridWidth = Math.max(
        260,
        gridEl
          ? Math.floor(gridEl.getBoundingClientRect().width)
          : Math.floor(Math.min(viewportW * 0.92, 360)),
      );

      const gap = Math.max(4, Math.min(8, Math.round(gridWidth * 0.012)));
      const introHeight = intro ? Math.ceil(intro.getBoundingClientRect().height) : 0;
      const stageGaps = STAGE_GAP_PX;
      let iconStackGap = ICON_STACK_GAP_PX;

      if (finalPass) {
        const body = screen.querySelector<HTMLElement>('.mobile-screen__body');
        const bodyHeight = body ? Math.floor(body.getBoundingClientRect().height) : 0;
        if (bodyHeight > 0) {
          zoneHeight = Math.max(zoneHeight, bodyHeight);
        }
      }

      const verticalIconBudget = Math.max(
        ICON_SIZE_MIN_PX * ICON_ROWS + ICON_GRID_PAD_PX,
        zoneHeight - introHeight - CARD_MIN_PX - stageGaps,
      );

      let iconSize = measureIconSize(gridWidth, gap, verticalIconBudget, iconSizeMax, iconMinPx);
      let paginatorHeight = estimatePaginatorHeight(iconSize, gap);
      let cardMax = Math.max(
        CARD_MIN_PX,
        zoneHeight - introHeight - paginatorHeight - stageGaps - iconStackGap,
      );

      while (cardMax < CARD_MIN_PX && iconSize > iconMinPx) {
        iconSize -= 1;
        paginatorHeight = estimatePaginatorHeight(iconSize, gap);
        cardMax = Math.max(
          CARD_MIN_PX,
          zoneHeight - introHeight - paginatorHeight - stageGaps - iconStackGap,
        );
      }

      screen.style.setProperty('--servicios-mobile-icon-stack-gap', `${iconStackGap}px`);
      screen.style.setProperty('--servicios-mobile-icon-size', `${iconSize}px`);
      screen.style.setProperty('--servicios-mobile-icon-gap', `${gap}px`);
      screen.style.setProperty('--servicios-mobile-zone-height', `${zoneHeight}px`);
      screen.style.setProperty('--servicios-mobile-intro-height', `${introHeight}px`);
      screen.style.setProperty('--servicios-mobile-card-max-height', `${cardMax}px`);
      screen.style.setProperty('--servicios-mobile-carousel-zone-height', `${cardMax}px`);
      screen.style.setProperty('--servicios-mobile-paginator-reserve', `${paginatorHeight}px`);
      screen.style.setProperty('--servicios-mobile-paginator-height', `${paginatorHeight}px`);
      screen.style.setProperty('--servicios-mobile-intro-push', '0px');
      screen.style.setProperty('--servicios-mobile-block-offset-top', '0px');
      screen.style.setProperty('--servicios-mobile-block-offset-bottom', '0px');
      screen.style.setProperty(
        '--servicios-mobile-hero-max-height',
        `${Math.max(64, cardMax - CARD_FOOTER_FALLBACK_PX)}px`,
      );

      if (!finalPass) {
        screen.setAttribute('data-servicios-layout-ready', 'true');
        return;
      }

      const introActual = intro ? Math.ceil(intro.getBoundingClientRect().height) : introHeight;
      let paginatorActual = paginator
        ? Math.ceil(paginator.getBoundingClientRect().height)
        : paginatorHeight;
      const footerReserve = measureFooterReserve();

      cardMax = Math.max(
        CARD_MIN_PX,
        zoneHeight - introActual - paginatorActual - stageGaps - iconStackGap,
      );
      let heroMax = Math.max(64, cardMax - footerReserve);

      let blockHeight = introActual + cardMax + paginatorActual + stageGaps + iconStackGap;
      let slack = Math.max(0, zoneHeight - blockHeight);

      if (slack > 4) {
        const gapBoost = Math.min(
          ICON_STACK_GAP_MAX_PX - iconStackGap,
          Math.round(slack * 0.3),
        );
        if (gapBoost > 0) {
          iconStackGap += gapBoost;
          slack -= gapBoost;
          blockHeight = introActual + cardMax + paginatorActual + stageGaps + iconStackGap;
        }
      }

      if (slack > 2) {
        const iconBoost = Math.min(iconSizeMax - iconSize, Math.floor(slack / ICON_ROWS));
        if (iconBoost > 0) {
          iconSize += iconBoost;
          paginatorActual = estimatePaginatorHeight(iconSize, gap);
          cardMax = Math.max(
            CARD_MIN_PX,
            zoneHeight - introActual - paginatorActual - stageGaps - iconStackGap,
          );
          heroMax = Math.max(64, cardMax - footerReserve);
          blockHeight = introActual + cardMax + paginatorActual + stageGaps + iconStackGap;
          slack = Math.max(0, zoneHeight - blockHeight);
        }
      }

      if (slack > 0) {
        heroMax += Math.round(slack * 0.65);
        slack = Math.round(slack * 0.35);
      }

      const totalUsed = introActual + cardMax + paginatorActual + stageGaps + iconStackGap + slack;
      if (totalUsed > zoneHeight) {
        const excess = totalUsed - zoneHeight;
        cardMax = Math.max(CARD_MIN_PX, cardMax - excess);
        heroMax = Math.max(56, cardMax - footerReserve);
      }

      screen.style.setProperty('--servicios-mobile-icon-stack-gap', `${iconStackGap}px`);

      screen.style.setProperty('--servicios-mobile-icon-size', `${iconSize}px`);
      screen.style.setProperty('--servicios-mobile-card-max-height', `${cardMax}px`);
      screen.style.setProperty('--servicios-mobile-carousel-zone-height', `${cardMax}px`);
      screen.style.setProperty('--servicios-mobile-hero-max-height', `${heroMax}px`);
      screen.style.setProperty('--servicios-mobile-paginator-height', `${paginatorActual}px`);
      screen.style.setProperty('--servicios-mobile-paginator-reserve', `${paginatorActual}px`);
      screen.style.setProperty('--servicios-mobile-intro-height', `${introActual}px`);
      screen.style.setProperty('--servicios-mobile-stack-height', `${zoneHeight}px`);
      screen.style.setProperty(
        '--servicios-mobile-block-offset-bottom',
        `${MIN_BOTTOM_PX}px`,
      );

      screen.setAttribute('data-servicios-layout-ready', 'true');
    };

    const header = screen.querySelector('.mobile-screen__header');
    const intro = screen.querySelector('.servicios-mobile-intro');
    const contentStack = screen.querySelector('.servicios-mobile-content-stack');
    const paginator = screen.querySelector('.servicios-mobile-paginator');
    const card = screen.querySelector('.servicios-mobile-card');
    const iconGrid = screen.querySelector('.servicios-mobile-icon-grid');
    const body = screen.querySelector('.mobile-screen__body');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');

    const runMeasure = () => {
      applyLayout(false);
      requestAnimationFrame(() => {
        applyLayout(true);
        requestAnimationFrame(() => applyLayout(true));
      });
    };

    return subscribeMobileLayout(runMeasure, {
      observe: [screen, header, body, intro, contentStack, paginator, card, iconGrid, navRail, dock],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
