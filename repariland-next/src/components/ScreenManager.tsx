'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import InicioScreen from './screens/InicioScreen';
import HistoriaScreen from './screens/HistoriaScreen';
import ServiciosScreen from './screens/ServiciosScreen';
import NoticiasScreen from './screens/NoticiasScreen';
import ReelsScreen from './screens/ReelsScreen';
import ContactoScreen from './screens/ContactoScreen';
import { SCREEN_ORDER } from '@/hooks/useScreenManager';
import type { ScreenName } from '@/types';
import { getScreenEnterMotion, SCREEN_LAYER_TRANSITION } from '@/lib/motionPresets';

interface ScreenManagerProps {
  currentScreen: ScreenName;
  direction: number;
  onNavigate: (screen: ScreenName) => void;
}

function ScreenBody({
  screen,
  onNavigate,
  isScreenVisible,
}: {
  screen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  isScreenVisible: boolean;
}) {
  switch (screen) {
    case 'inicio':
      return <InicioScreen onNavigate={onNavigate} />;
    case 'historia':
      return <HistoriaScreen />;
    case 'servicios':
      return <ServiciosScreen />;
    case 'noticias':
      return <NoticiasScreen />;
    case 'reels':
      return <ReelsScreen isScreenActive={isScreenVisible} />;
    case 'contacto':
      return <ContactoScreen />;
    default:
      return null;
  }
}

export default function ScreenManager({
  currentScreen,
  direction,
  onNavigate,
}: ScreenManagerProps) {
  const reduceMotion = useReducedMotion();
  const [mountedScreens, setMountedScreens] = useState<Set<ScreenName>>(
    () => new Set([currentScreen]),
  );
  const prevScreenRef = useRef(currentScreen);

  useEffect(() => {
    setMountedScreens((prev) => {
      if (prev.has(currentScreen)) return prev;
      const next = new Set(prev);
      next.add(currentScreen);
      return next;
    });
  }, [currentScreen]);

  useEffect(() => {
    if (reduceMotion) {
      setMountedScreens(new Set(SCREEN_ORDER));
      return;
    }
    const mountAll = () => setMountedScreens(new Set(SCREEN_ORDER));
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(mountAll, { timeout: 1600 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(mountAll, 600);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  const isScreenEntering = currentScreen !== prevScreenRef.current;
  useEffect(() => {
    prevScreenRef.current = currentScreen;
  }, [currentScreen]);

  const layerTransition = reduceMotion
    ? { opacity: { duration: 0 } }
    : SCREEN_LAYER_TRANSITION;

  return (
    <motion.div
      className="pointer-events-none relative z-[10] flex h-full min-h-0 w-full flex-1 flex-col"
      layout={false}
    >
      <motion.div
        className="app-content-max relative flex min-h-0 w-full flex-1 flex-col overflow-hidden"
        custom={direction}
        layout={false}
      >
        {SCREEN_ORDER.filter((screen) => mountedScreens.has(screen)).map((screen) => {
          const active = screen === currentScreen;
          const enterMotion = getScreenEnterMotion(direction, reduceMotion);

          return (
            <motion.div
              key={screen}
              custom={direction}
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
              }}
              transition={layerTransition}
              style={{
                pointerEvents: active ? 'auto' : 'none',
              }}
              aria-hidden={!active}
              className={[
                'screen-transition-layer absolute inset-0 flex min-h-0 w-full flex-col',
                active ? 'z-[2]' : 'z-[1]',
              ].join(' ')}
            >
              <motion.div className="pointer-events-auto relative flex min-h-0 w-full flex-1 flex-col overflow-hidden">
                <motion.div
                  className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden"
                  initial={
                    active && isScreenEntering && !reduceMotion
                      ? enterMotion.initial
                      : false
                  }
                  animate={active ? enterMotion.animate : enterMotion.animate}
                  transition={enterMotion.transition}
                >
                  <ScreenBody screen={screen} onNavigate={onNavigate} isScreenVisible={active} />
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
