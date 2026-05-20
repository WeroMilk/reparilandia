/** Throttle de mediciones de layout en móvil (evita jank por ResizeObserver en ráfaga). */
const LAYOUT_THROTTLE_MS = 96;

type LayoutCleanup = () => void;

export function scheduleMobileLayout(run: () => void): void {
  scheduleMobileLayoutImpl(run);
}

let rafId = 0;
let timeoutId = 0;
let pendingRun: (() => void) | null = null;
let lastFlush = 0;

function scheduleMobileLayoutImpl(run: () => void): void {
  pendingRun = run;
  if (rafId !== 0) return;

  rafId = requestAnimationFrame(() => {
    rafId = 0;
    const fn = pendingRun;
    if (!fn) return;

    const elapsed = performance.now() - lastFlush;
    if (elapsed < LAYOUT_THROTTLE_MS) {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        timeoutId = 0;
        scheduleMobileLayoutImpl(fn);
      }, LAYOUT_THROTTLE_MS - elapsed);
      return;
    }

    lastFlush = performance.now();
    pendingRun = null;
    fn();
  });
}

export function cancelScheduledMobileLayout(): void {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  if (timeoutId) {
    window.clearTimeout(timeoutId);
    timeoutId = 0;
  }
  pendingRun = null;
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

  const schedule = () => scheduleMobileLayout(measure);

  if (runOnMount) schedule();

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

  return () => {
    ro.disconnect();
    for (const mq of mediaQueries) {
      mq.removeEventListener('change', onMqChange);
    }
    window.removeEventListener('resize', schedule);
    window.visualViewport?.removeEventListener('resize', schedule);
    cancelScheduledMobileLayout();
  };
}
