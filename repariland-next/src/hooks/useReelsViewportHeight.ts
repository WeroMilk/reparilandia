import { useEffect } from 'react';

/**
 * Acota la zona de vídeo entre la cabecera REELS y el borde superior del rail
 * de navegación (6 botones), midiendo posiciones reales del DOM.
 */
export function useReelsViewportHeight(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const screen = document.querySelector<HTMLElement>('[data-screen="reels"]');
    if (!screen) return;

    const measure = () => {
      const header = screen.querySelector<HTMLElement>('.reels-screen__header');
      const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
      if (!header || !navRail) {
        screen.removeAttribute('data-reels-layout-ready');
        screen.style.removeProperty('--reels-body-height');
        return;
      }

      const headerBottom = header.getBoundingClientRect().bottom;
      const navTop = navRail.getBoundingClientRect().top;
      const height = Math.max(0, Math.round(navTop - headerBottom));

      screen.style.setProperty('--reels-body-height', `${height}px`);
      screen.setAttribute('data-reels-layout-ready', 'true');
    };

    const scheduleMeasure = () => {
      requestAnimationFrame(() => {
        measure();
        requestAnimationFrame(measure);
      });
    };

    scheduleMeasure();

    const ro = new ResizeObserver(scheduleMeasure);
    const header = screen.querySelector('.reels-screen__header');
    const navRail = document.querySelector('[data-app-dock] .dock-nav-rail');
    if (header) ro.observe(header);
    if (navRail) ro.observe(navRail);
    const dock = document.querySelector('[data-app-dock]');
    if (dock) ro.observe(dock);

    window.addEventListener('resize', scheduleMeasure);
    window.visualViewport?.addEventListener('resize', scheduleMeasure);
    window.visualViewport?.addEventListener('scroll', scheduleMeasure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
      window.visualViewport?.removeEventListener('resize', scheduleMeasure);
      window.visualViewport?.removeEventListener('scroll', scheduleMeasure);
      screen.removeAttribute('data-reels-layout-ready');
      screen.style.removeProperty('--reels-body-height');
    };
  }, [enabled]);
}
