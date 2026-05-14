import { useState, useCallback } from 'react';
import type { ScreenName } from '@/types';

const screenOrder: ScreenName[] = ['inicio', 'historia', 'servicios', 'noticias', 'contacto'];

export function useScreenManager() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('inicio');
  const [direction, setDirection] = useState(1);

  const navigateTo = useCallback((screen: ScreenName) => {
    const currentIndex = screenOrder.indexOf(currentScreen);
    const targetIndex = screenOrder.indexOf(screen);
    setDirection(targetIndex > currentIndex ? 1 : -1);
    setCurrentScreen(screen);
  }, [currentScreen]);

  const goNext = useCallback(() => {
    const currentIndex = screenOrder.indexOf(currentScreen);
    if (currentIndex < screenOrder.length - 1) {
      setDirection(1);
      setCurrentScreen(screenOrder[currentIndex + 1]);
    }
  }, [currentScreen]);

  const goPrev = useCallback(() => {
    const currentIndex = screenOrder.indexOf(currentScreen);
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentScreen(screenOrder[currentIndex - 1]);
    }
  }, [currentScreen]);

  return {
    currentScreen,
    direction,
    navigateTo,
    goNext,
    goPrev,
  };
}
