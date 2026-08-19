'use client';

import { useEffect } from 'react';
import { preloadScreenAssets } from '@/lib/screenAssets';
import type { ScreenName } from '@/types';

/** Precarga solo la pantalla visible; el resto espera a que se visite. */
export function usePreloadScreenAssets(enabled: boolean, screen: ScreenName) {
  useEffect(() => {
    if (!enabled) return;

    const run = () => preloadScreenAssets(screen);

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(run, { timeout: 800 });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(run, 180);
    return () => window.clearTimeout(t);
  }, [enabled, screen]);
}
