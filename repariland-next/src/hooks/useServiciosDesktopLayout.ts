import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const DOCK_CLEARANCE_PX = 14;
const CARD_MIN_PX = 160;
const CARD_FOOTER_FALLBACK_PX = 86;
/** Hueco mínimo entre tarjeta e iconos (el resto se reparte en el offset). */
const DESKTOP_CARD_ICON_GAP_PX = 10;
/** Reserva inferior mínima dentro del cálculo de altura de tarjeta. */
const CARD_BOTTOM_MARGIN_PX = 8;
const PAGINATOR_OFFSET_MAX_PX = 72;

function measureSlideFooterReserve(screen: HTMLElement): number {
  const slide = screen.querySelector<HTMLElement>('.servicios-desktop-slide');
  if (!slide) return CARD_FOOTER_FALLBACK_PX;
  const desc = slide.querySelector<HTMLElement>('.servicios-slide-desc');
  const cta = slide.querySelector<HTMLElement>('.servicios-slide-cta');
  const descH = desc ? Math.ceil(desc.getBoundingClientRect().height) : 0;
  const ctaH = cta ? Math.ceil(cta.getBoundingClientRect().height) : 0;
  return Math.max(56, descH + ctaH + 14);
}

function measureHeroCaptionReserve(screen: HTMLElement): number {
  const caption = screen.querySelector<HTMLElement>('.servicio-hero-caption');
  return caption ? Math.ceil(caption.getBoundingClientRect().height) : 28;
}

/**
 * Altura útil de Servicios en escritorio (entre cabecera y dock).
 */
export function useServiciosDesktopLayout(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="servicios"]') ??
      document.querySelector<HTMLElement>('.servicios-screen.screen-shell');
    if (!screen) return;

    const desktopMq = window.matchMedia('(min-width: 1024px)');

    const clear = () => {
      screen.removeAttribute('data-servicios-desktop-ready');
      screen.style.removeProperty('--servicios-desktop-zone-height');
      screen.style.removeProperty('--servicios-desktop-main-height');
      screen.style.removeProperty('--servicios-desktop-card-height');
      screen.style.removeProperty('--servicios-desktop-hero-max-height');
      screen.style.removeProperty('--servicios-desktop-hero-art-height');
      screen.style.removeProperty('--servicios-desktop-paginator-offset-top');
    };

    const measure = (finalPass = false) => {
      if (!desktopMq.matches) {
        clear();
        return;
      }

      const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      const dock = document.querySelector<HTMLElement>('[data-app-dock]');
      if (!header || !navRail) {
        clear();
        return;
      }

      const headerBottom = header.getBoundingClientRect().bottom;
      const navTop = navRail.getBoundingClientRect().top;
      const dockTop = dock?.getBoundingClientRect().top ?? navTop;
      const vv = window.visualViewport;
      const visibleBottom =
        vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      const zoneBottom = Math.min(navTop, dockTop, visibleBottom) - DOCK_CLEARANCE_PX;
      const zoneHeight = Math.max(0, Math.round(zoneBottom - headerBottom));

      screen.setAttribute('data-servicios-desktop-ready', 'true');

      const stage = screen.querySelector<HTMLElement>('.servicios-desktop-stage');
      const intro = screen.querySelector<HTMLElement>('.servicios-desktop-intro');
      const paginator = screen.querySelector<HTMLElement>('.servicios-desktop-paginator');
      const introHeight = intro ? Math.ceil(intro.getBoundingClientRect().height) : 0;
      const paginatorHeight = paginator
        ? Math.ceil(paginator.getBoundingClientRect().height)
        : 0;

      let stageGapPx = 0;
      if (stage) {
        const stageStyles = window.getComputedStyle(stage);
        const gap = parseFloat(stageStyles.rowGap || stageStyles.gap || '0') || 0;
        stageGapPx = Math.round(gap);
      }

      const paginatorOffsetCurrent = finalPass
        ? 0
        : Math.round(
            parseFloat(
              screen.style.getPropertyValue('--servicios-desktop-paginator-offset-top') || '0',
            ) || 0,
          );

      const availableForMain = Math.max(
        CARD_MIN_PX + paginatorHeight,
        zoneHeight - introHeight - stageGapPx,
      );
      const availableForCard = Math.max(
        CARD_MIN_PX,
        availableForMain -
          paginatorHeight -
          paginatorOffsetCurrent -
          DESKTOP_CARD_ICON_GAP_PX -
          CARD_BOTTOM_MARGIN_PX,
      );
      let cardHeight = availableForCard;
      const slidePadPx = 20;
      const slideGapPx = 6;
      const footerReserve = measureSlideFooterReserve(screen);
      const captionReserve = measureHeroCaptionReserve(screen);
      let heroArtMax = Math.max(
        96,
        cardHeight - footerReserve - captionReserve - slidePadPx - slideGapPx,
      );

      screen.style.setProperty('--servicios-desktop-zone-height', `${zoneHeight}px`);
      screen.style.setProperty('--servicios-desktop-main-height', `${cardHeight}px`);
      screen.style.setProperty('--servicios-desktop-card-height', `${cardHeight}px`);
      screen.style.setProperty('--servicios-desktop-hero-max-height', `${heroArtMax}px`);
      screen.style.setProperty('--servicios-desktop-hero-art-height', `${heroArtMax}px`);

      if (!finalPass) {
        return;
      }

      const cardEl = screen.querySelector<HTMLElement>(
        '.servicios-desktop-main .servicios-mobile-card',
      );
      const iconRow = screen.querySelector<HTMLElement>('.servicios-icon-row--desktop');
      if (!cardEl || !iconRow) {
        screen.style.setProperty('--servicios-desktop-paginator-offset-top', '0px');
        return;
      }

      const cardBottom = cardEl.getBoundingClientRect().bottom;
      const iconRect = iconRow.getBoundingClientRect();
      const bandBottom = zoneBottom;
      const bandHeight = Math.max(0, bandBottom - cardBottom);
      const idealIconTop = cardBottom + (bandHeight - iconRect.height) / 2;
      let offsetTop = Math.round(Math.max(0, idealIconTop - iconRect.top));
      offsetTop = Math.min(offsetTop, PAGINATOR_OFFSET_MAX_PX);

      const maxCardShrink = Math.max(0, cardHeight - CARD_MIN_PX);
      offsetTop = Math.min(offsetTop, maxCardShrink);

      if (offsetTop > 0) {
        cardHeight -= offsetTop;
        heroArtMax = Math.max(
          96,
          cardHeight - footerReserve - captionReserve - slidePadPx - slideGapPx,
        );
        screen.style.setProperty('--servicios-desktop-main-height', `${cardHeight}px`);
        screen.style.setProperty('--servicios-desktop-card-height', `${cardHeight}px`);
        screen.style.setProperty('--servicios-desktop-hero-max-height', `${heroArtMax}px`);
        screen.style.setProperty('--servicios-desktop-hero-art-height', `${heroArtMax}px`);
      }

      screen.style.setProperty('--servicios-desktop-paginator-offset-top', `${offsetTop}px`);
    };

    const header = screen.querySelector('.mobile-screen__header');
    const body = screen.querySelector('.mobile-screen__body');
    const stage = screen.querySelector('.servicios-desktop-stage');
    const intro = screen.querySelector('.servicios-desktop-intro');
    const paginator = screen.querySelector('.servicios-desktop-paginator');
    const main = screen.querySelector('.servicios-desktop-main');
    const card = screen.querySelector('.servicios-mobile-card');
    const heroArt = screen.querySelector('.servicios-slide-hero-art');
    const iconRow = screen.querySelector('.servicios-icon-row--desktop');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');

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
        header,
        body,
        stage,
        intro,
        paginator,
        main,
        card,
        heroArt,
        iconRow,
        navRail,
        dock,
      ],
      mediaQueries: [desktopMq],
    });
  }, [enabled]);
}
