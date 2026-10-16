/** Lienzo de escritorio. Todo el layout se calcula aquí y luego se escala al monitor. */
export const DESKTOP_STAGE_WIDTH = 1920;
export const DESKTOP_STAGE_HEIGHT = 1080;
export const DESKTOP_STAGE_MIN_WIDTH = 1024;
export const DESKTOP_STAGE_FRAME_NAME = 'reparilandia-desktop';

/** Ancho de diseño móvil (iPhone SE). El alto sigue al dispositivo para que el dock llegue al borde. */
export const MOBILE_STAGE_WIDTH = 375;
export const MOBILE_STAGE_HEIGHT = 667;
export const MOBILE_STAGE_FRAME_NAME = 'reparilandia-mobile';

export function isEmbeddedFrame(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function readViewportSize(): { width: number; height: number } {
  const vv = window.visualViewport;
  return {
    width: vv?.width ?? window.innerWidth,
    height: vv?.height ?? window.innerHeight,
  };
}

function containScale(viewportWidth: number, viewportHeight: number, stageWidth: number, stageHeight: number): number {
  const next = Math.min(viewportWidth / stageWidth, viewportHeight / stageHeight);
  if (!Number.isFinite(next) || next <= 0) return 1;
  return Math.floor(next * 1000) / 1000;
}

/** Escala uniforme para que el lienzo quepa completo, sin recortar el dock ni los laterales. */
export function desktopStageScale(viewport = readViewportSize()): number {
  return containScale(viewport.width, viewport.height, DESKTOP_STAGE_WIDTH, DESKTOP_STAGE_HEIGHT);
}

/** Escala al ancho del teléfono. El alto del marco se calcula aparte para llenar la pantalla. */
export function mobileStageScale(viewport = readViewportSize()): number {
  const next = viewport.width / MOBILE_STAGE_WIDTH;
  if (!Number.isFinite(next) || next <= 0) return 1;
  return Math.floor(next * 1000) / 1000;
}

/** Alto CSS del marco móvil para que, ya escalado, cubra el alto real del dispositivo. */
export function mobileStageHeight(viewport = readViewportSize(), scale = mobileStageScale(viewport)): number {
  if (!Number.isFinite(scale) || scale <= 0) return MOBILE_STAGE_HEIGHT;
  const height = viewport.height / scale;
  if (!Number.isFinite(height) || height <= 0) return MOBILE_STAGE_HEIGHT;
  return Math.ceil(height);
}
