import { useEffect } from 'react';

/**
 * Ancla la app al viewport visible. Safari iOS resta barras que Chrome inspect
 * no simula (iPhone 8 Plus CSS 414×736 ≈ 414×628 útiles). Sin esto, 100dvh
 * deja el dock y el contenido bajo el chrome del teléfono.
 */
export function applyVisualViewportLock(): void {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const width = Math.round(vv?.width ?? window.innerWidth);
  const height = Math.round(vv?.height ?? window.innerHeight);
  const offsetTop = Math.round(vv?.offsetTop ?? 0);
  const bottomInset = Math.max(0, Math.round(window.innerHeight - offsetTop - height));

  root.style.setProperty('--app-width', `${width}px`);
  root.style.setProperty('--app-height', `${height}px`);
  root.style.setProperty('--app-vv-top', `${offsetTop}px`);
  root.style.setProperty('--app-bottom-inset', `${bottomInset}px`);
  root.style.setProperty('--mobile-viewport-h', `${height}px`);
}

export function useVisualViewportLock() {
  useEffect(() => {
    let raf = 0;

    const schedule = () => {
      if (raf !== 0) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        applyVisualViewportLock();
      });
    };

    applyVisualViewportLock();
    const visualViewport = window.visualViewport;
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule);
    visualViewport?.addEventListener('resize', schedule, { passive: true });
    visualViewport?.addEventListener('scroll', schedule, { passive: true });

    return () => {
      if (raf !== 0) window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      visualViewport?.removeEventListener('resize', schedule);
      visualViewport?.removeEventListener('scroll', schedule);
    };
  }, []);
}
