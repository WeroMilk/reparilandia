import { useEffect } from 'react';

/**
 * Ancla la app al visualViewport (misma base que Android/Chrome).
 * En iOS Safari solo compensamos cuando la URL inferior solapa de verdad;
 * no forzamos ~50px extra que aplastan todas las pantallas.
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

function syncDockReserve(): void {
  const root = document.documentElement;
  const dock =
    document.querySelector<HTMLElement>('[data-app-dock] .dock-chrome') ??
    document.querySelector<HTMLElement>('[data-app-dock]');
  if (!dock) return;
  const h = Math.ceil(dock.getBoundingClientRect().height);
  if (h < 40) return;
  root.style.setProperty('--dock-reserve', `${h}px`);
}

/** Lift del dock si la URL solapa; no encogemos el shell (eso sube todo el diseño). */
const IOS_OVERLAY_DOCK_LIFT_PX = 28;

export function applyVisualViewportLock(): void {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const width = Math.round(vv?.width ?? window.innerWidth);
  const offsetTop = Math.round(vv?.offsetTop ?? 0);
  const vvHeight = Math.round(vv?.height ?? window.innerHeight);
  const reportedInset = Math.max(0, Math.round(window.innerHeight - offsetTop - vvHeight));

  let height = vvHeight;
  let bottomInset = reportedInset;
  let safariBottomChrome = 0;

  if (isIosSafari() && !isStandaloneDisplay()) {
    const overlaysBottom = reportedInset < 8;
    if (overlaysBottom) {
      /* Solo sube el dock sobre la URL; el contenido sigue usando todo el alto VV. */
      safariBottomChrome = IOS_OVERLAY_DOCK_LIFT_PX;
      bottomInset = IOS_OVERLAY_DOCK_LIFT_PX;
      height = vvHeight;
    } else {
      safariBottomChrome = 0;
      bottomInset = reportedInset;
    }
  }

  root.style.setProperty('--app-width', `${width}px`);
  root.style.setProperty('--app-height', `${height}px`);
  root.style.setProperty('--app-vv-top', `${offsetTop}px`);
  root.style.setProperty('--app-bottom-inset', `${bottomInset}px`);
  root.style.setProperty('--safari-bottom-chrome', `${safariBottomChrome}px`);
  root.style.setProperty('--mobile-viewport-h', `${height}px`);
  root.dataset.iosSafariChrome = safariBottomChrome > 0 ? '1' : '0';
  syncDockReserve();
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

    const dock = document.querySelector('[data-app-dock]');
    const ro =
      typeof ResizeObserver !== 'undefined' && dock
        ? new ResizeObserver(() => schedule())
        : null;
    if (dock && ro) ro.observe(dock);

    return () => {
      if (raf !== 0) window.cancelAnimationFrame(raf);
      window.clearTimeout(scrollTimer);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      visualViewport?.removeEventListener('resize', schedule);
      visualViewport?.removeEventListener('scroll', onVvScroll);
      ro?.disconnect();
    };
  }, []);
}
