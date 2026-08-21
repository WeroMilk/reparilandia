import { useEffect } from 'react';

/**
 * Ancla la app al viewport visible. En iPhone Safari la URL inferior puede
 * tapar el dock/captions: reservamos --safari-bottom-chrome en el padding.
 */
function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const webkit = /WebKit/i.test(ua);
  const criOS = /CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
  return iOS && webkit && !criOS;
}

function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia?.('(display-mode: standalone)')?.matches;
  const legacy = Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return Boolean(mq || legacy);
}

export function applyVisualViewportLock(): void {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const width = Math.round(vv?.width ?? window.innerWidth);
  const offsetTop = Math.round(vv?.offsetTop ?? 0);
  const height = Math.round(vv?.height ?? window.innerHeight);
  const bottomInset = Math.max(0, Math.round(window.innerHeight - offsetTop - height));

  let safariBottomChrome = 0;
  if (isIosSafari() && !isStandaloneDisplay()) {
    /* Reserva mínima para la barra URL / tab bar inferior (~44–56px). */
    safariBottomChrome = Math.max(bottomInset, 48);
  }

  root.style.setProperty('--app-width', `${width}px`);
  root.style.setProperty('--app-height', `${height}px`);
  root.style.setProperty('--app-vv-top', `${offsetTop}px`);
  root.style.setProperty('--app-bottom-inset', `${Math.max(bottomInset, safariBottomChrome)}px`);
  root.style.setProperty('--safari-bottom-chrome', `${safariBottomChrome}px`);
  root.style.setProperty('--mobile-viewport-h', `${height}px`);
  root.dataset.iosSafariChrome = safariBottomChrome > 0 ? '1' : '0';
}

export function useVisualViewportLock() {
  useEffect(() => {
    let raf = 0;
    let scrollTimer = 0;

    const schedule = () => {
      if (raf !== 0) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        applyVisualViewportLock();
      });
    };

    const onVvScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(schedule, 48);
    };

    applyVisualViewportLock();
    const visualViewport = window.visualViewport;
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule);
    visualViewport?.addEventListener('resize', schedule, { passive: true });
    visualViewport?.addEventListener('scroll', onVvScroll, { passive: true });

    return () => {
      if (raf !== 0) window.cancelAnimationFrame(raf);
      window.clearTimeout(scrollTimer);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      visualViewport?.removeEventListener('resize', schedule);
      visualViewport?.removeEventListener('scroll', onVvScroll);
    };
  }, []);
}
