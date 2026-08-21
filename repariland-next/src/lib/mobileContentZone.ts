/**
 * Medición única de la zona útil móvil (header → dock).
 * Usa visualViewport como Safari real; Chrome inspect suele reportar más alto
 * porque no resta el chrome del navegador — por eso alineamos todo a VV.
 */
export type MobileContentZone = {
  zoneHeight: number;
  headerBottom: number;
  zoneBottom: number;
  viewportH: number;
  viewportW: number;
};

export function measureMobileContentZone(
  screen: HTMLElement,
  options?: { dockClearancePx?: number },
): MobileContentZone | null {
  const dockClearancePx = options?.dockClearancePx ?? 8;
  const header = screen.querySelector<HTMLElement>('.mobile-screen__header');
  const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
  const dock = document.querySelector<HTMLElement>('[data-app-dock]');
  if (!header || !navRail) return null;

  const navRect = navRail.getBoundingClientRect();
  if (navRect.height <= 0 || navRect.top >= window.innerHeight) return null;

  const headerBottom = header.getBoundingClientRect().bottom;
  const navTop = navRect.top;
  const dockTop = dock?.getBoundingClientRect().top ?? navTop;
  const vv = window.visualViewport;

  /* Preferir --app-height (lock VV) cuando exista: misma fuente que el shell. */
  const appHRaw = getComputedStyle(document.documentElement).getPropertyValue('--app-height').trim();
  const appH = appHRaw.endsWith('px') ? Number.parseFloat(appHRaw) : NaN;
  const vvBottom =
    vv != null
      ? vv.offsetTop + vv.height
      : Number.isFinite(appH)
        ? appH
        : window.innerHeight;

  const zoneBottom = Math.min(navTop, dockTop, vvBottom) - dockClearancePx;
  const zoneHeight = Math.max(0, Math.round(zoneBottom - headerBottom));

  return {
    zoneHeight,
    headerBottom,
    zoneBottom,
    viewportH: Math.round(vv?.height ?? (Number.isFinite(appH) ? appH : window.innerHeight)),
    viewportW: Math.round(vv?.width ?? window.innerWidth),
  };
}
