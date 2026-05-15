import { useEffect } from 'react';
import type { ScreenName } from '@/types';
const SCREEN_NAMES: ScreenName[] = ['inicio', 'historia', 'servicios', 'noticias', 'contacto'];

function pointInRect(x: number, y: number, r: DOMRect) {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

function runDockAction(
  action: string,
  handlers: {
    navigateTo: (screen: ScreenName) => void;
    goNext: () => void;
    goPrev: () => void;
    dock: Element;
  },
) {
  if (action === 'prev') {
    handlers.goPrev();
    return true;
  }
  if (action === 'next') {
    handlers.goNext();
    return true;
  }
  if (action === 'privacy' || action === 'cookies' || action === 'legal') {
    const btn = handlers.dock.querySelector<HTMLElement>(`[data-dock-action="${action}"]`);
    btn?.click();
    return true;
  }
  if (action.startsWith('nav-')) {
    const screen = action.slice(4) as ScreenName;
    if (SCREEN_NAMES.includes(screen)) {
      handlers.navigateTo(screen);
      return true;
    }
  }
  return false;
}

/**
 * Si una capa del contenido intercepta el clic, enruta por coordenadas dentro del rect del dock.
 */
export function useDockGeometricCapture(
  enabled: boolean,
  handlers: {
    navigateTo: (screen: ScreenName) => void;
    goNext: () => void;
    goPrev: () => void;
  },
) {
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      const dock = document.querySelector('[data-app-dock]');
      if (!dock) return;

      const rect = dock.getBoundingClientRect();
      if (!pointInRect(e.clientX, e.clientY, rect)) return;

      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-app-dock]')) return;

      const actions = dock.querySelectorAll<HTMLElement>('[data-dock-action]');
      for (const el of actions) {
        const br = el.getBoundingClientRect();
        if (!pointInRect(e.clientX, e.clientY, br)) continue;
        const action = el.dataset.dockAction;
        if (!action) continue;
        const handled = runDockAction(action, { ...handlers, dock });
        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
    };

    window.addEventListener('pointerdown', onPointerDown, true);
    return () => window.removeEventListener('pointerdown', onPointerDown, true);
  }, [enabled, handlers.navigateTo, handlers.goNext, handlers.goPrev]);
}
