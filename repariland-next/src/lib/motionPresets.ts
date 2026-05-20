/** Curva tipo iOS (entrada/salida suave, sin rebote brusco). */
export const MOTION_IOS_EASE = [0.32, 0.72, 0, 1] as const;

export const MOTION_IOS_EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const MOTION_IOS_SPRING = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 36,
  mass: 0.82,
};

/** Transición entre pantallas del dock (crossfade + desplazamiento sutil). */
export const SCREEN_LAYER_TRANSITION = {
  opacity: { duration: 0.4, ease: MOTION_IOS_EASE },
};

export const SCREEN_ENTER_OFFSET = 16;

export function getScreenEnterMotion(
  direction: number,
  reduceMotion: boolean | null,
): { initial: Record<string, number | string>; animate: Record<string, number | string>; transition: object } {
  if (reduceMotion) {
    return {
      initial: { opacity: 1, x: 0, scale: 1 },
      animate: { opacity: 1, x: 0, scale: 1 },
      transition: { duration: 0 },
    };
  }
  return {
    initial: {
      opacity: 0.9,
      x: direction * SCREEN_ENTER_OFFSET,
      scale: 0.994,
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    transition: {
      duration: 0.48,
      ease: MOTION_IOS_EASE,
      opacity: { duration: 0.38, ease: MOTION_IOS_EASE_OUT },
    },
  };
}

/** Cambio de box/panel dentro de una pantalla (p. ej. contacto ↔ mensaje). */
export const PANEL_SWAP_TRANSITION = {
  duration: 0.44,
  ease: MOTION_IOS_EASE,
};

export const panelSwapVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 22 : -18,
    scale: 0.988,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -14 : 18,
    scale: 0.992,
  }),
};

/** Duración base del scroll Embla (más alto = más fluido al deslizar). */
export const EMBLA_SMOOTH_DURATION = 32;
