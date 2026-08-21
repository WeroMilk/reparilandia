/**
 * Medición única de la zona útil móvil (header → dock).
 * Misma fuente que el shell (--app-height / visualViewport) para iOS ≈ Android.
 */
export type MobileContentZone = {
  zoneHeight: number;
  headerBottom: number;
  zoneBottom: number;
  viewportH: number;
  viewportW: number;
};

function readCssPx(name: string): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return NaN;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : NaN;
}

export function measureMobileContentZone(
  screen: HTMLElement,
  options?: { dockClearancePx?: number; headerSelector?: string },
): MobileContentZone | null {
  const dockClearancePx = options?.dockClearancePx ?? 8;
  const headerSelector = options?.headerSelector ?? '.mobile-screen__header';
  const header = screen.querySelector<HTMLElement>(headerSelector);
  const navRail = document.querySelector<HTMLElement>('[data-app-dock] .dock-nav-rail');
  const dock = document.querySelector<HTMLElement>('[data-app-dock]');
  if (!header || !navRail) return null;

  const navRect = navRail.getBoundingClientRect();
  if (navRect.height <= 0 || navRect.top >= window.innerHeight) return null;

  const headerBottom = header.getBoundingClientRect().bottom;
  const navTop = navRect.top;
  const dockTop = dock?.getBoundingClientRect().top ?? navTop;
  const vv = window.visualViewport;

  const appH = readCssPx('--app-height');
  const appTop = readCssPx('--app-vv-top');
  const shellBottom =
    Number.isFinite(appH) && appH > 0
      ? (Number.isFinite(appTop) ? appTop : 0) + appH
      : vv != null
        ? vv.offsetTop + vv.height
        : window.innerHeight;

  const vvBottom = vv != null ? vv.offsetTop + vv.height : shellBottom;
  const visibleBottom = Math.min(shellBottom, vvBottom);

  const zoneBottom = Math.min(navTop, dockTop, visibleBottom) - dockClearancePx;
  const zoneHeight = Math.max(0, Math.round(zoneBottom - headerBottom));

  return {
    zoneHeight,
    headerBottom,
    zoneBottom,
    viewportH: Math.round(
      Number.isFinite(appH) && appH > 0 ? appH : (vv?.height ?? window.innerHeight),
    ),
    viewportW: Math.round(vv?.width ?? window.innerWidth),
  };
}
