/** Throttle de mediciones de layout en móvil (evita jank por ResizeObserver en ráfaga). */
const LAYOUT_THROTTLE_MS = 120;

type LayoutCleanup = () => void;

const pendingRuns = new Set<() => void>();

let rafId = 0;
let timeoutId = 0;
let lastFlush = 0;
/** Mientras > 0, se ignoran disparos de ResizeObserver (evita bucles al setear CSS vars). */
let suppressDepth = 0;

export function beginMobileLayoutSuppress(): void {
  suppressDepth += 1;
}

export function endMobileLayoutSuppress(): void {
  suppressDepth = Math.max(0, suppressDepth - 1);
  if (suppressDepth === 0 && pendingRuns.size > 0) {
    scheduleFlush();
  }
}

export function scheduleMobileLayout(run: () => void): void {
  pendingRuns.add(run);
  if (suppressDepth > 0) return;
  scheduleFlush();
}

function scheduleFlush(): void {
  if (rafId !== 0 || timeoutId !== 0) return;

  rafId = requestAnimationFrame(() => {
    rafId = 0;
    if (pendingRuns.size === 0) return;

    const elapsed = performance.now() - lastFlush;
    if (elapsed < LAYOUT_THROTTLE_MS) {
      timeoutId = window.setTimeout(() => {
        timeoutId = 0;
        scheduleFlush();
      }, LAYOUT_THROTTLE_MS - elapsed);
      return;
    }

    lastFlush = performance.now();
    const batch = [...pendingRuns];
    pendingRuns.clear();
    beginMobileLayoutSuppress();
    try {
      for (const fn of batch) {
        try {
          fn();
        } catch {
          /* no tumbar otras mediciones */
        }
      }
    } finally {
      // Liberar en el siguiente frame para que el RO del propio apply no reentrante.
      requestAnimationFrame(() => {
        endMobileLayoutSuppress();
      });
    }
  });
}

/** Cancela una medición concreta; sin argumento limpia el lote pendiente. */
export function cancelScheduledMobileLayout(run?: () => void): void {
  if (run) {
    pendingRuns.delete(run);
    return;
  }
  pendingRuns.clear();
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  if (timeoutId) {
    window.clearTimeout(timeoutId);
    timeoutId = 0;
  }
}

export type SubscribeMobileLayoutOptions = {
  /** Si false, no registra listeners (p. ej. pantalla inactiva). */
  enabled?: boolean;
  /** Media queries que deben disparar re-medición al cambiar (p. ej. desktop ↔ móvil). */
  mediaQueries?: MediaQueryList[];
  /** Elementos a observar con ResizeObserver. */
  observe?: Array<Element | null | undefined>;
  /** Ejecutar al suscribir. */
  runOnMount?: boolean;
};

/**
 * Registra medición de layout con throttle y sin visualViewport scroll
 * (el scroll del viewport disparaba recálculos en bucle y lag en móvil).
 */
export function subscribeMobileLayout(
  measure: () => void,
  options: SubscribeMobileLayoutOptions = {},
): LayoutCleanup {
  const { enabled = true, mediaQueries = [], observe = [], runOnMount = true } = options;
  if (!enabled) return () => {};

  const schedule = () => {
    scheduleMobileLayout(measure);
  };

  if (runOnMount) {
    measure();
    schedule();
  }

  const ro = new ResizeObserver(schedule);
  for (const el of observe) {
    if (el) ro.observe(el);
  }

  const onMqChange = () => schedule();
  for (const mq of mediaQueries) {
    mq.addEventListener('change', onMqChange);
  }
  window.addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });

  const dock = document.querySelector('[data-app-dock]');
  const rail = dock?.querySelector('.dock-nav-rail');
  if (dock) ro.observe(dock);
  if (rail) ro.observe(rail);

  let mo: MutationObserver | undefined;
  if (!rail) {
    mo = new MutationObserver(() => {
      const liveDock = document.querySelector('[data-app-dock]');
      const liveRail = liveDock?.querySelector('.dock-nav-rail');
      if (!liveDock || !liveRail) return;
      ro.observe(liveDock);
      ro.observe(liveRail);
      measure();
      schedule();
      mo?.disconnect();
      mo = undefined;
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  const late = [
    window.setTimeout(() => {
      measure();
      schedule();
    }, 50),
    window.setTimeout(() => {
      measure();
      schedule();
    }, 320),
  ];

  return () => {
    for (const id of late) window.clearTimeout(id);
    mo?.disconnect();
    ro.disconnect();
    for (const mq of mediaQueries) {
      mq.removeEventListener('change', onMqChange);
    }
    window.removeEventListener('resize', schedule);
    window.visualViewport?.removeEventListener('resize', schedule);
    cancelScheduledMobileLayout(measure);
  };
}
