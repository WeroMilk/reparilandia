import { useEffect } from 'react';

/**
 * Ancla la app al viewport visible. En iPhone Safari la URL inferior no debe
 * tapar captions ni el dock: si el chrome solapa, encogemos el shell.
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
  /* Solo reserva de padding; no mutar --dock-chrome-height (rompe el layout). */
  root.style.setProperty('--dock-reserve', `${h}px`);
}

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
    /* Tab/URL bar inferior típica ~50px. Si VV no la resta, encogemos el shell. */
    const overlay = reportedInset < 24;
    safariBottomChrome = Math.max(reportedInset, 50);
    if (overlay) {
      height = Math.max(300, vvHeight - safariBottomChrome);
      bottomInset = safariBottomChrome;
    } else {
      bottomInset = Math.max(reportedInset, safariBottomChrome);
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
