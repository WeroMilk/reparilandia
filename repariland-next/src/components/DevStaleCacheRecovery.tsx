'use client';

import { useEffect } from 'react';
import { stripFreshFromUrl } from '@/lib/devStaleChunk';

/**
 * En desarrollo: quita ?_fresh= de la URL si quedó de un bucle antiguo.
 * Si ves 404 en chunks viejos: Ctrl+Shift+R (recarga forzada).
 */
export default function DevStaleCacheRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (!new URLSearchParams(window.location.search).has('_fresh')) return;
    stripFreshFromUrl();
  }, []);

  return null;
}
