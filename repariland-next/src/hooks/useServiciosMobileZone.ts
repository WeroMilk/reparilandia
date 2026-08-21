import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';
import { measureMobileContentZone } from '@/lib/mobileContentZone';

const DOCK_CLEARANCE_PX = 10;
const ICON_STACK_GAP_PX = 6;
const ICON_SIZE_MIN_PX = 26;
const ICON_SIZE_MAX_PX = 40;
const ICON_ROW_FIRST = 6;
const ICON_ROW_SECOND = 5;
const ICON_ROWS = 2;
const ICON_GRID_PAD_PX = 8;
const ICON_ROW_GAP_PX = 5;
const DOTS_RESERVE_PX = 20;
const CARD_MIN_PX = 160;
/** Reserva realista para título + descripción + CTA. */
const CARD_FOOTER_FALLBACK_PX = 72;
const ICON_SIZE_MAX_TALL_PX = 44;
const TALL_ZONE_MIN_PX = 340;
const TALL_ZONE_RANGE_PX = 200;
const TALL_FILL_THRESHOLD = 0.12;
/** Compacto solo en zonas realmente chicas (no el 8 Plus inspect vs Safari). */
const SHORT_ZONE_PX = 360;
const SHORT_ZONE_RANGE_PX = 80;
const COMPACT_THRESHOLD = 0.08;
const BOTTOM_SAFE_PX = 8;
const ICON_SIZE_MIN_COMPACT_PX = 24;
/** Ignorar cambios de 1–2px para no oscilar. */
const STABLE_EPS_PX = 2;

function mobileTallFillFactor(_viewportH: number, zoneHeight: number): number {
  return Math.max(0, Math.min(1, (zoneHeight - TALL_ZONE_MIN_PX) / TALL_ZONE_RANGE_PX));
}

function mobileCompactFactor(_viewportH: number, zoneHeight: number): number {
  return Math.max(0, Math.min(1, (SHORT_ZONE_PX - zoneHeight) / SHORT_ZONE_RANGE_PX));
}

function readPxVar(screen: HTMLElement, name: string): number | null {
  const raw = screen.style.getPropertyValue(name).trim();
  if (!raw.endsWith('px')) return null;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

function setPxVarIfChanged(screen: HTMLElement, name: string, value: number): boolean {
  const prev = readPxVar(screen, name);
  const next = Math.round(value);
  if (prev != null && Math.abs(prev - next) <= STABLE_EPS_PX) return false;
  screen.style.setProperty(name, `${next}px`);
  return true;
}

/**
 * Altura de la zona útil en Servicios (móvil): intro + tarjeta + rejilla + puntos.
 * Zona anclada a header→dock (estable). No observa nodos que ella misma redimensiona.
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
      iconSize * ICON_ROWS + ICON_ROW_GAP_PX + ICON_GRID_PAD_PX + DOTS_RESERVE_PX + gap;

    const measureIconSize = (
      gridWidth: number,
      gap: number,
      verticalBudget: number,
      iconSizeMax: number,
      iconMinPx: number,
    ) => {
      const iconFromRowFirst = Math.floor((gridWidth - gap * (ICON_ROW_FIRST - 1)) / ICON_ROW_FIRST);
      const iconFromRowSecond = Math.floor(
        (gridWidth - gap * (ICON_ROW_SECOND - 1)) / ICON_ROW_SECOND,
      );
      const iconFromWidth = Math.min(iconFromRowFirst, iconFromRowSecond);
      const iconFromHeight = Math.floor(
        (verticalBudget - ICON_GRID_PAD_PX - ICON_ROW_GAP_PX - DOTS_RESERVE_PX) / ICON_ROWS,
      );
      return Math.max(iconMinPx, Math.min(iconFromWidth, iconFromHeight, iconSizeMax));
    };

    const measureZoneSpan = () => {
      const zone = measureMobileContentZone(screen, { dockClearancePx: DOCK_CLEARANCE_PX });
      if (!zone) return null;
      return {
        zoneHeight: zone.zoneHeight,
        viewportH: zone.viewportH,
        viewportW: zone.viewportW,
      };
    };

    const applyLayout = () => {
      if (desktopMq.matches) {
        clear();
        return;
      }

      const zoneMetrics = measureZoneSpan();
      if (!zoneMetrics || zoneMetrics.zoneHeight < 120) return;

      const { zoneHeight, viewportH, viewportW } = zoneMetrics;
      const tallFill = mobileTallFillFactor(viewportH, zoneHeight);
      const compactFill = mobileCompactFactor(viewportH, zoneHeight);
      const iconMinPx =
        compactFill >= COMPACT_THRESHOLD ? ICON_SIZE_MIN_COMPACT_PX : ICON_SIZE_MIN_PX;
      const iconSizeMax =
        ICON_SIZE_MAX_PX + Math.round(tallFill * (ICON_SIZE_MAX_TALL_PX - ICON_SIZE_MAX_PX));

      const isSmallMobile =
        tallFill < TALL_FILL_THRESHOLD &&
        (compactFill >= COMPACT_THRESHOLD || zoneHeight <= SHORT_ZONE_PX);

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
      const stageGapPx =
        tallFill >= TALL_FILL_THRESHOLD
          ? Math.round(6 + tallFill * 4)
          : Math.round(4 + compactFill * 3);
      screen.style.setProperty('--servicios-mobile-stage-gap', `${stageGapPx}px`);

      const intro = screen.querySelector<HTMLElement>('.servicios-mobile-intro');
      const gridEl = screen.querySelector<HTMLElement>('.servicios-mobile-icon-grid');

      // Intro se mide una vez: no depende del tamaño de la tarjeta.
      const introHeight = intro ? Math.ceil(intro.getBoundingClientRect().height) : 0;

      const gridWidth = Math.max(
        260,
        gridEl
          ? Math.floor(gridEl.getBoundingClientRect().width)
          : Math.floor(Math.min(viewportW * 0.92, 360)),
      );
      const gap = Math.max(4, Math.min(8, Math.round(gridWidth * 0.012)));
      const iconStackGap = ICON_STACK_GAP_PX;

      // Presupuesto vertical SIN re-medición circular: iconos estimados, no medidos post-apply.
      const verticalIconBudget = Math.max(
        ICON_SIZE_MIN_PX * ICON_ROWS + ICON_GRID_PAD_PX,
        Math.round((zoneHeight - introHeight - CARD_MIN_PX - stageGapPx) * 0.26),
      );
      const iconSize = measureIconSize(gridWidth, gap, verticalIconBudget, iconSizeMax, iconMinPx);
      const paginatorHeight = estimatePaginatorHeight(iconSize, gap);

      const cardMax = Math.max(
        CARD_MIN_PX,
        zoneHeight - introHeight - paginatorHeight - stageGapPx - iconStackGap - BOTTOM_SAFE_PX,
      );
      const heroMax = Math.max(168, Math.min(cardMax - CARD_FOOTER_FALLBACK_PX, Math.round(cardMax * 0.62)));

      let changed = false;
      changed = setPxVarIfChanged(screen, '--servicios-mobile-zone-height', zoneHeight) || changed;
      changed = setPxVarIfChanged(screen, '--servicios-mobile-intro-height', introHeight) || changed;
      changed =
        setPxVarIfChanged(screen, '--servicios-mobile-icon-stack-gap', iconStackGap) || changed;
      changed = setPxVarIfChanged(screen, '--servicios-mobile-icon-size', iconSize) || changed;
      changed = setPxVarIfChanged(screen, '--servicios-mobile-icon-gap', gap) || changed;
      changed = setPxVarIfChanged(screen, '--servicios-mobile-card-max-height', cardMax) || changed;
      changed =
        setPxVarIfChanged(screen, '--servicios-mobile-carousel-zone-height', cardMax) || changed;
      changed = setPxVarIfChanged(screen, '--servicios-mobile-hero-max-height', heroMax) || changed;
      changed =
        setPxVarIfChanged(screen, '--servicios-mobile-paginator-height', paginatorHeight) ||
        changed;
      changed =
        setPxVarIfChanged(screen, '--servicios-mobile-paginator-reserve', paginatorHeight) ||
        changed;
      changed = setPxVarIfChanged(screen, '--servicios-mobile-stack-height', zoneHeight) || changed;
      screen.style.setProperty('--servicios-mobile-intro-push', '0px');
      screen.style.setProperty('--servicios-mobile-block-offset-top', '0px');
      setPxVarIfChanged(screen, '--servicios-mobile-block-offset-bottom', BOTTOM_SAFE_PX);

      if (!screen.hasAttribute('data-servicios-layout-ready')) {
        screen.setAttribute('data-servicios-layout-ready', 'true');
        changed = true;
      }

      void changed;
    };

    // Solo observar anclas estables (NO card/paginator/body/stack: eso causa el bounce).
    const header = screen.querySelector('.mobile-screen__header');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');

    applyLayout();

    return subscribeMobileLayout(applyLayout, {
      observe: [screen, header, navRail, dock],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
