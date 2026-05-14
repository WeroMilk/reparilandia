'use client';

import { useEffect, useState } from 'react';

export interface ParticleBudgetState {
  /** Evita mismatch SSR/cliente: no dibujar hasta conocer prefers-reduced-motion y viewport. */
  ready: boolean;
  count: number;
}

/** Menos nodos en móvil; sin animación si el sistema pide reduced motion. */
export function useParticleBudget(): ParticleBudgetState {
  const [state, setState] = useState<ParticleBudgetState>({ ready: false, count: 0 });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 1023px)');

    const sync = () => {
      if (reduced.matches) {
        setState({ ready: true, count: 0 });
        return;
      }
      setState({ ready: true, count: narrow.matches ? 52 : 88 });
    };

    sync();
    reduced.addEventListener('change', sync);
    narrow.addEventListener('change', sync);
    return () => {
      reduced.removeEventListener('change', sync);
      narrow.removeEventListener('change', sync);
    };
  }, []);

  return state;
}
