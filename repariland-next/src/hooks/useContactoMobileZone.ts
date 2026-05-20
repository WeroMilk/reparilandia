import { useEffect } from 'react';

/**
 * Altura de la zona útil en Contacto (móvil): entre cabecera y rail de 6 botones.
 */
export function useContactoMobileZone(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen =
      document.querySelector<HTMLElement>('[data-screen="contacto"]') ??
      document.querySelector<HTMLElement>('.contacto-screen.screen-shell');
    if (!screen) return;

    const mq = window.matchMedia('(min-width: 1024px)');

    const measure = () => {
      if (mq.matches) {
        screen.removeAttribute('data-contacto-layout-ready');
        screen.style.removeProperty('--contacto-mobile-zone-height');
        return;
      }

      const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      if (!header || !navRail) {
        screen.removeAttribute('data-contacto-layout-ready');
        screen.style.removeProperty('--contacto-mobile-zone-height');
        return;
      }

      const headerBottom = header.getBoundingClientRect().bottom;
      const navTop = navRail.getBoundingClientRect().top;
      const vv = window.visualViewport;
      const visibleBottom =
        vv != null ? vv.offsetTop + vv.height : window.innerHeight;
      const height = Math.max(
        0,
        Math.round(Math.min(navTop, visibleBottom) - headerBottom),
      );

      screen.style.setProperty('--contacto-mobile-zone-height', `${height}px`);
      screen.setAttribute('data-contacto-layout-ready', 'true');
    };

    const scheduleMeasure = () => {
      requestAnimationFrame(() => {
        measure();
        requestAnimationFrame(measure);
      });
    };

    scheduleMeasure();

    const ro = new ResizeObserver(scheduleMeasure);
    const header = screen.querySelector('.mobile-screen__header');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    const dock = document.querySelector('[data-app-dock]');
    ro.observe(screen);
    if (header) ro.observe(header);
    if (navRail) ro.observe(navRail);
    if (dock) ro.observe(dock);

    mq.addEventListener('change', scheduleMeasure);
    window.addEventListener('resize', scheduleMeasure);
    window.visualViewport?.addEventListener('resize', scheduleMeasure);
    window.visualViewport?.addEventListener('scroll', scheduleMeasure);

    return () => {
      ro.disconnect();
      mq.removeEventListener('change', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      window.visualViewport?.removeEventListener('resize', scheduleMeasure);
      window.visualViewport?.removeEventListener('scroll', scheduleMeasure);
      screen.removeAttribute('data-contacto-layout-ready');
      screen.style.removeProperty('--contacto-mobile-zone-height');
    };
  }, [enabled]);
}
