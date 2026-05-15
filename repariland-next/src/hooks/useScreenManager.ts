import { useCallback, useReducer } from 'react';
import type { ScreenName } from '@/types';
export const SCREEN_ORDER: readonly ScreenName[] = [
  'inicio',
  'historia',
  'servicios',
  'noticias',
  'contacto',
] as const;

function screenIndex(screen: ScreenName): number {
  return SCREEN_ORDER.indexOf(screen);
}

type NavState = {
  currentScreen: ScreenName;
  direction: number;
};

type NavAction =
  | { type: 'goto'; screen: ScreenName }
  | { type: 'next' }
  | { type: 'prev' };

function navReducer(state: NavState, action: NavAction): NavState {
  switch (action.type) {
    case 'goto': {
      if (state.currentScreen === action.screen) return state;
      const delta = screenIndex(action.screen) - screenIndex(state.currentScreen);
      return { currentScreen: action.screen, direction: delta >= 0 ? 1 : -1 };
    }
    case 'next': {
      const next = SCREEN_ORDER[(screenIndex(state.currentScreen) + 1) % SCREEN_ORDER.length];
      if (next === state.currentScreen) return state;
      return { currentScreen: next, direction: 1 };
    }
    case 'prev': {
      const next =
        SCREEN_ORDER[
          (screenIndex(state.currentScreen) - 1 + SCREEN_ORDER.length) % SCREEN_ORDER.length
        ];
      if (next === state.currentScreen) return state;
      return { currentScreen: next, direction: -1 };
    }
    default:
      return state;
  }
}

export function useScreenManager() {
  const [{ currentScreen, direction }, dispatch] = useReducer(navReducer, {
    currentScreen: 'inicio',
    direction: 1,
  });

  const navigateTo = useCallback((screen: ScreenName) => {
    dispatch({ type: 'goto', screen });
  }, []);

  const goNext = useCallback(() => {
    dispatch({ type: 'next' });
  }, []);

  const goPrev = useCallback(() => {
    dispatch({ type: 'prev' });
  }, []);

  return {
    currentScreen,
    direction,
    navigateTo,
    goNext,
    goPrev,
  };
}
