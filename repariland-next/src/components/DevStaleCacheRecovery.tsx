'use client';

import { useEffect } from 'react';

/**
 * En desarrollo: si el HTML en caché pide chunks del Pages Router, fuerza una recarga limpia.
 */
export default function DevStaleCacheRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const params = new URLSearchParams(window.location.search);
    if (params.has('_fresh')) return;

    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const stale = scripts.some((el) => {
      const src = el.getAttribute('src') ?? '';
      return (
        /\/main\.js(\?|$)/.test(src) ||
        /\/react-refresh\.js(\?|$)/.test(src) ||
        /\/_app\.js(\?|$)/.test(src) ||
        /\/pages\/_app\.js/.test(src)
      );
    });

    if (!stale) return;

    const url = new URL(window.location.href);
    url.searchParams.set('_fresh', String(Date.now()));
    window.location.replace(url.toString());
  }, []);

  return null;
}
