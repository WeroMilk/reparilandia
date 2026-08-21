import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const DOCK_CLEARANCE_PX = 12;
/** Solo dots; el margen bajo la card debe ser mínimo. */
const CAROUSEL_FOOT_FLOOR_PX = 22;
/** Gap card → dots (muy corto). */
const FOOT_GAP_PX = 4;
const CAPTION_RESERVE_PX = 62;
const CARD_CHROME_PAD_PX = 8;
const CARD_MIN_HEIGHT_PX = 160;
/** Hueco mínimo bajo el borde dentro del embla. */
const BORDER_CLEARANCE_PX = 6;
const BOTTOM_EDGE_PX = 3;
/** Margen inferior de los rectángulos: corto (solo dots + respiración). */
const CARD_BOTTOM_MARGIN_MIN_PX = 22;
const CARD_BOTTOM_MARGIN_MAX_PX = 30;
const HOVER_HALO_INSET_PX = 2;
const TALL_ZONE_MIN_PX = 240;
const TALL_ZONE_RANGE_PX = 220;
/** Compacto solo en zonas realmente cortas (Safari iPhone ~400–480). */
const SHORT_BODY_ZONE_PX = 500;
const SLIDE_BASIS_PERCENT = 100;
const SLIDE_GAP_PX = 0;
const LOGO_BASE_REM = 5.9;
const LOGO_TALL_BOOST_REM = 2.0;
const LOGO_COMPACT_CAP_REM = 5.1;
const PREFERRED_HERO_VH = 0.5;
const PREFERRED_HERO_MIN_PX = 250;
const PREFERRED_HERO_MAX_PX = 480;
const STABLE_EPS_PX = 2;

function mobileTallFillFactor(zoneSpan: number): number {
  return Math.max(0, Math.min(1, (zoneSpan - TALL_ZONE_MIN_PX) / TALL_ZONE_RANGE_PX));
}

/**
 * Zona del carrusel de boxes en Inicio (móvil): rellena entre cabecera y dock
 * con la misma lógica limpia que el layout de escritorio (sin overhead doble).
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
      screen.style.removeProperty('--inicio-mobile-caption-size');
      screen.style.removeProperty('--inicio-mobile-carousel-foot-reserve');
      screen.style.removeProperty('--inicio-mobile-carousel-track-height');
      screen.style.removeProperty('--inicio-mobile-scroll-page-height');
      screen.style.removeProperty('--inicio-mobile-bottom-margin');
      screen.style.removeProperty('--inicio-mobile-border-clearance');
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
      screen.style.removeProperty('--inicio-mobile-foot-gap');
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
        return;
      }

      const navRect = navRail.getBoundingClientRect();
      if (navRect.height <= 0 || navRect.top >= window.innerHeight) {
        return;
      }

      const headerBottom = header?.getBoundingClientRect().bottom ?? topBlock.getBoundingClientRect().top;
      const navTop = navRect.top;
      const dockTop = dock?.getBoundingClientRect().top ?? navTop;
      const vv = window.visualViewport;
      const visibleBottom = vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      /* dockTop ya sube con --app-bottom-inset (barra URL iPhone). */
      const visibleNavTop = Math.min(navTop, dockTop, visibleBottom) - DOCK_CLEARANCE_PX;
      const bodyZoneHeight = Math.max(0, Math.round(visibleNavTop - headerBottom));
      const viewportH = Math.round(vv != null ? vv.height : window.innerHeight);
      const viewportW = Math.round(vv != null ? vv.width : window.innerWidth);
      const tallFill = mobileTallFillFactor(bodyZoneHeight);
      const isCompact = bodyZoneHeight <= SHORT_BODY_ZONE_PX;

      const stageGap = Math.round(isCompact ? 4 : 6 + tallFill * 2);
      const topGap = Math.round(isCompact ? 2 : 4 + tallFill);
      const hoverInset = HOVER_HALO_INSET_PX;
      const edgeGutter = Math.max(6, Math.min(10, Math.round(viewportW * 0.02)));
      const sectionGap = FOOT_GAP_PX;
      const cardMaxWidth = Math.round(
        Math.max(288, Math.min(viewportW - edgeGutter * 2 - 4, Math.round(viewportW * 0.96))),
      );
      /* Margen corto bajo los rectángulos (no expandir hueco vacío). */
      const cardBottomMargin = Math.round(
        Math.min(
          CARD_BOTTOM_MARGIN_MAX_PX,
          Math.max(CARD_BOTTOM_MARGIN_MIN_PX, isCompact ? 22 : 26),
        ),
      );

      const caption = screen.querySelector<HTMLElement>(
        '.inicio-home-card--mobile-carousel .inicio-home-card__caption',
      );
      const captionHeight = caption
        ? Math.ceil(caption.getBoundingClientRect().height)
        : CAPTION_RESERVE_PX;
      const captionReserve = Math.max(CAPTION_RESERVE_PX, captionHeight + 12 + BOTTOM_EDGE_PX);

      let logoMaxRem = isCompact
        ? LOGO_COMPACT_CAP_REM
        : LOGO_BASE_REM + tallFill * LOGO_TALL_BOOST_REM;
      let guaranteeScale = isCompact ? 0.86 : 0.9 + tallFill * 0.06;
      let sloganSizeRem = isCompact ? 0.66 : 0.72 + tallFill * 0.08;

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
      screen.style.setProperty('--inicio-mobile-bottom-margin', `${cardBottomMargin}px`);
      screen.style.setProperty('--inicio-mobile-hover-inset', `${hoverInset}px`);
      screen.style.setProperty('--inicio-mobile-foot-gap', `${FOOT_GAP_PX}px`);
      screen.style.setProperty('--inicio-mobile-border-clearance', `${BORDER_CLEARANCE_PX}px`);

      const topEl = screen.querySelector<HTMLElement>('.inicio-mobile-top');
      const footEl = screen.querySelector<HTMLElement>('.inicio-mobile-carousel-foot');
      const measureTopHeight = () =>
        topEl ? Math.ceil(topEl.getBoundingClientRect().height) : 0;
      const measureFootHeight = () =>
        Math.max(
          CAROUSEL_FOOT_FLOOR_PX,
          footEl ? Math.ceil(footEl.getBoundingClientRect().height) : 0,
        );

      let topH = measureTopHeight();
      /* Para dimensionar la card usamos el margen completo (dots viven dentro). */
      let footH = Math.max(cardBottomMargin, measureFootHeight());

      const carouselOverhead = stageGap + topGap + hoverInset * 2;

      const availableCard = Math.max(
        CARD_MIN_HEIGHT_PX,
        bodyZoneHeight - topH - footH - carouselOverhead,
      );

      const preferredHero = Math.round(
        Math.min(
          PREFERRED_HERO_MAX_PX,
          Math.max(PREFERRED_HERO_MIN_PX, viewportH * PREFERRED_HERO_VH),
          cardMaxWidth * 0.98,
        ),
      );

      let heroMaxHeight = Math.min(
        preferredHero,
        Math.max(PREFERRED_HERO_MIN_PX, availableCard - captionReserve - CARD_CHROME_PAD_PX),
      );
      let cardMaxHeight = Math.min(
        availableCard,
        heroMaxHeight + captionReserve + CARD_CHROME_PAD_PX,
      );

      if (finalPass) {
        const heroTarget = Math.min(
          preferredHero,
          Math.max(PREFERRED_HERO_MIN_PX + 16, Math.round(viewportH * 0.44)),
        );
        let guard = 0;
        while (heroMaxHeight < heroTarget && logoMaxRem > 4.2 && guard < 8) {
          logoMaxRem = Math.max(4.2, logoMaxRem - 0.45);
          guaranteeScale = Math.max(0.78, guaranteeScale - 0.04);
          sloganSizeRem = Math.max(0.6, sloganSizeRem - 0.03);
          screen.style.setProperty('--inicio-mobile-logo-max-height', `${logoMaxRem.toFixed(2)}rem`);
          screen.style.setProperty('--inicio-mobile-slogan-size', `${sloganSizeRem.toFixed(3)}rem`);
          screen.style.setProperty('--inicio-mobile-guarantee-scale', guaranteeScale.toFixed(3));
          topH = measureTopHeight();
          const avail = Math.max(
            CARD_MIN_HEIGHT_PX,
            bodyZoneHeight - topH - footH - carouselOverhead,
          );
          heroMaxHeight = Math.min(
            preferredHero,
            Math.max(PREFERRED_HERO_MIN_PX, avail - captionReserve - CARD_CHROME_PAD_PX),
          );
          cardMaxHeight = Math.min(avail, heroMaxHeight + captionReserve + CARD_CHROME_PAD_PX);
          guard += 1;
        }

        footH = Math.max(cardBottomMargin, measureFootHeight());
        const availFinal = Math.max(
          CARD_MIN_HEIGHT_PX,
          bodyZoneHeight - topH - footH - carouselOverhead,
        );
        heroMaxHeight = Math.min(
          preferredHero,
          Math.max(PREFERRED_HERO_MIN_PX, availFinal - captionReserve - CARD_CHROME_PAD_PX),
        );
        cardMaxHeight = Math.min(
          availFinal,
          Math.max(CARD_MIN_HEIGHT_PX, heroMaxHeight + captionReserve + CARD_CHROME_PAD_PX),
        );

        screen.style.setProperty('--inicio-mobile-hero-max-height', `${Math.round(heroMaxHeight)}px`);
        screen.style.setProperty('--inicio-home-card-caption-reserve', `${Math.round(captionReserve)}px`);
        const cardEl = screen.querySelector<HTMLElement>('.inicio-mobile-slide__inner');
        if (cardEl) {
          const measuredCard = Math.ceil(cardEl.getBoundingClientRect().height);
          if (measuredCard > 0) {
            cardMaxHeight = Math.min(availFinal, Math.max(cardMaxHeight, measuredCard + 2));
          }
        }

        screen.style.setProperty('--inicio-mobile-block-offset-top', '0px');
        screen.style.setProperty('--inicio-mobile-block-offset-bottom', '0px');
      }

      const zoneSpan = Math.max(
        CARD_MIN_HEIGHT_PX,
        bodyZoneHeight - topH - stageGap - topGap,
      );
      /* Track = altura de tarjeta + barra inferior + clearance del embla. */
      const finalTrack = cardMaxHeight + BOTTOM_EDGE_PX + BORDER_CLEARANCE_PX;

      const setPx = (name: string, value: number) => {
        const prev = Number.parseFloat(screen.style.getPropertyValue(name));
        if (Number.isFinite(prev) && Math.abs(prev - value) <= STABLE_EPS_PX) return;
        screen.style.setProperty(name, `${Math.round(value)}px`);
      };

      setPx('--inicio-mobile-boxes-zone-height', zoneSpan);
      setPx('--inicio-mobile-body-zone-height', bodyZoneHeight);
      setPx('--inicio-mobile-carousel-track-height', finalTrack);
      setPx('--inicio-mobile-scroll-page-height', finalTrack);
      setPx('--inicio-mobile-edge-gutter', edgeGutter);
      setPx('--inicio-mobile-section-gap', sectionGap);
      setPx('--inicio-mobile-card-max-width', cardMaxWidth);
      setPx('--inicio-mobile-card-max-height', cardMaxHeight);
      setPx('--inicio-mobile-hero-max-height', heroMaxHeight);
      setPx('--inicio-home-card-caption-reserve', captionReserve);
      setPx('--inicio-mobile-carousel-foot-reserve', footH);
      setPx('--inicio-mobile-bottom-margin', cardBottomMargin);
      screen.style.setProperty('--inicio-mobile-caption-size', isCompact ? '15px' : '16px');
      screen.style.setProperty('--inicio-mobile-slide-gap', `${SLIDE_GAP_PX}px`);
      screen.style.setProperty('--inicio-mobile-slide-basis', `${SLIDE_BASIS_PERCENT}%`);

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
