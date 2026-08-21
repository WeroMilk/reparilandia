'use client';

import { useEffect } from 'react';
import { preloadScreenAssets } from '@/lib/screenAssets';
import type { ScreenName } from '@/types';

/** Precarga la pantalla visible; Inicio ya se dispara al montar App. */
export function usePreloadScreenAssets(enabled: boolean, screen: ScreenName) {
  useEffect(() => {
    if (!enabled) return;
    if (screen === 'inicio') return;

    const run = () => preloadScreenAssets(screen);

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(run, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(run, 120);
    return () => window.clearTimeout(t);
  }, [enabled, screen]);
}
