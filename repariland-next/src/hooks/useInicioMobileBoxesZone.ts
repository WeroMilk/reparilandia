import { useEffect } from 'react';
import { subscribeMobileLayout } from '@/lib/mobileLayoutMeasure';

const DOCK_CLEARANCE_PX = 12;
const CAROUSEL_FOOT_FLOOR_PX = 26;
const CAROUSEL_ROW_GAP_PX = 4;
const CAPTION_RESERVE_PX = 44;
const CARD_CHROME_PAD_PX = 10;
const CARD_MIN_HEIGHT_PX = 140;
const BOTTOM_BOX_MARGIN_PX = 4;
/** Espacio bajo la tarjeta para que el borde inferior no se recorte. */
const BORDER_CLEARANCE_PX = 8;
const HOVER_HALO_INSET_FILL_PX = 2;
const TALL_VIEWPORT_MIN_PX = 620;
const TALL_VIEWPORT_RANGE_PX = 320;
const TALL_ZONE_MIN_PX = 240;
const TALL_ZONE_RANGE_PX = 220;
const TALL_MIN_BOTTOM_PX = 4;
const SHORT_VIEWPORT_PX = 760;
const SHORT_BODY_ZONE_PX = 540;
const SLIDE_BASIS_PERCENT = 100;
const SLIDE_GAP_PX = 0;
const LOGO_BASE_REM = 6.1;
const LOGO_TALL_BOOST_REM = 2.2;
const LOGO_COMPACT_CAP_REM = 4.85;
/** Imagen más grande: usa el alto disponible sin tope artificial bajo. */
const PREFERRED_HERO_VH = 0.48;
const PREFERRED_HERO_MIN_PX = 200;
const PREFERRED_HERO_MAX_PX = 420;
const STABLE_EPS_PX = 2;

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
      const measuredSpan = Math.max(0, Math.round(visibleNavTop - headerBottom));
      const viewportH = Math.round(vv != null ? vv.height : window.innerHeight);
      const viewportW = Math.round(vv != null ? vv.width : window.innerWidth);
      // No usar bodyHeight si se estira bajo el dock (provoca recorte del borde/caption).
      let bodyZoneHeight = measuredSpan;
      const tallFill = mobileTallFillFactor(viewportH, bodyZoneHeight);
      const isCompact =
        viewportH <= SHORT_VIEWPORT_PX || bodyZoneHeight <= SHORT_BODY_ZONE_PX;

      const bottomMargin = Math.round(
        isCompact ? 2 + tallFill : BOTTOM_BOX_MARGIN_PX + tallFill,
      );
      const stageGap = Math.round(isCompact ? 2 + tallFill : 2 + tallFill * 2);
      const topGap = Math.round(isCompact ? 0 : 1 + tallFill);
      const hoverInset = HOVER_HALO_INSET_FILL_PX;

      const edgeGutter = Math.max(6, Math.min(10, Math.round(viewportW * 0.02)));
      const sectionGap = Math.max(4, Math.min(8, Math.round(viewportW * 0.016 + tallFill * 2)));
      const cardMaxWidth = Math.round(
        Math.max(288, Math.min(viewportW - edgeGutter * 2 - 4, Math.round(viewportW * 0.96))),
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
      const captionReserve = Math.max(CAPTION_RESERVE_PX, captionHeight + 4);

      let logoMaxRem = isCompact
        ? LOGO_COMPACT_CAP_REM
        : LOGO_BASE_REM + tallFill * LOGO_TALL_BOOST_REM;
      let guaranteeScale = isCompact ? 0.82 : 0.88 + tallFill * 0.08;
      let sloganSizeRem = isCompact ? 0.64 : 0.7 + tallFill * 0.1;

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
        stageGap +
        topGap +
        TALL_MIN_BOTTOM_PX +
        hoverInset * 2 +
        bottomMargin +
        CAROUSEL_ROW_GAP_PX +
        BORDER_CLEARANCE_PX;

      // Espacio máximo disponible para el rectángulo (imagen + texto + borde).
      const availableCard = Math.max(
        CARD_MIN_HEIGHT_PX,
        bodyZoneHeight - topH - footH - carouselOverhead,
      );

      // Hero: prioriza llenar el alto disponible (como Servicios), con tope razonable.
      const preferredHero = Math.round(
        Math.min(
          PREFERRED_HERO_MAX_PX,
          Math.max(PREFERRED_HERO_MIN_PX, viewportH * PREFERRED_HERO_VH),
          cardMaxWidth * 0.95,
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
          Math.max(PREFERRED_HERO_MIN_PX + 24, Math.round(viewportH * 0.42)),
        );
        let guard = 0;
        while (heroMaxHeight < heroTarget && logoMaxRem > 4.0 && guard < 8) {
          logoMaxRem = Math.max(4.0, logoMaxRem - 0.55);
          guaranteeScale = Math.max(0.72, guaranteeScale - 0.055);
          sloganSizeRem = Math.max(0.58, sloganSizeRem - 0.035);
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

        footH = measureFootHeight();
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

        // Aplicar hero primero y medir la tarjeta real (incluye marco inferior).
        screen.style.setProperty('--inicio-mobile-hero-max-height', `${Math.round(heroMaxHeight)}px`);
        screen.style.setProperty('--inicio-home-card-caption-reserve', `${Math.round(captionReserve)}px`);
        const cardEl = screen.querySelector<HTMLElement>(
          '.inicio-mobile-slide__inner',
        );
        if (cardEl) {
          const measuredCard = Math.ceil(cardEl.getBoundingClientRect().height);
          if (measuredCard > 0) {
            cardMaxHeight = Math.min(availFinal, Math.max(cardMaxHeight, measuredCard + 2));
          }
        }

        screen.style.setProperty('--inicio-mobile-block-offset-top', '0px');
        screen.style.setProperty('--inicio-mobile-block-offset-bottom', `${TALL_MIN_BOTTOM_PX}px`);
      }

      const zoneSpan = Math.max(
        CARD_MIN_HEIGHT_PX,
        bodyZoneHeight - topH - stageGap - topGap - TALL_MIN_BOTTOM_PX,
      );
      // Track ≈ tarjeta + hueco mínimo (sin sumar clearance dos veces).
      const finalTrack = cardMaxHeight + Math.max(bottomMargin, BORDER_CLEARANCE_PX);

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
      setPx('--inicio-mobile-border-clearance', BORDER_CLEARANCE_PX);
      screen.style.setProperty(
        '--inicio-mobile-caption-size',
        isCompact ? '15px' : '16px',
      );
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
