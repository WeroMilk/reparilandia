'use client';

import { useEffect } from 'react';
import { preloadScreenAssets } from '@/lib/screenAssets';

/** Precarga PNG de todas las pantallas tras el boot (idle o timeout corto). */
export function usePreloadScreenAssets(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const run = () => preloadScreenAssets();

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(run, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(run, 400);
    return () => window.clearTimeout(t);
  }, [enabled]);
}
