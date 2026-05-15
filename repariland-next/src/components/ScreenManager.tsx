'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import InicioScreen from './screens/InicioScreen';
import HistoriaScreen from './screens/HistoriaScreen';
import ServiciosScreen from './screens/ServiciosScreen';
import NoticiasScreen from './screens/NoticiasScreen';
import ContactoScreen from './screens/ContactoScreen';
import { SCREEN_ORDER } from '@/hooks/useScreenManager';
import type { ScreenName } from '@/types';

interface ScreenManagerProps {
  currentScreen: ScreenName;
  direction: number;
  onNavigate: (screen: ScreenName) => void;
}

const crossfadeEase = [0.22, 1, 0.36, 1] as const;
const CROSSFADE_S = 0.2;

function ScreenBody({
  screen,
  onNavigate,
}: {
  screen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
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

  const fadeDuration = reduceMotion ? 0 : CROSSFADE_S;

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
          return (
            <motion.div
              key={screen}
              custom={direction}
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                y: active ? 0 : reduceMotion ? 0 : direction >= 0 ? 6 : -6,
              }}
              transition={{
                opacity: { duration: fadeDuration, ease: crossfadeEase },
                y: { duration: fadeDuration * 0.9, ease: crossfadeEase },
              }}
              style={{
                transformOrigin: '50% 0%',
                pointerEvents: active ? 'auto' : 'none',
              }}
              aria-hidden={!active}
              className={[
                'absolute inset-0 flex min-h-0 w-full flex-col',
                active ? 'z-[2]' : 'z-[1]',
                !active && 'invisible',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div
                className={[
                  'pointer-events-auto relative flex min-h-0 w-full flex-1 flex-col overscroll-y-contain pb-2 scrollbar-hide [-webkit-overflow-scrolling:touch]',
                  screen === 'contacto'
                    ? 'overflow-x-visible overflow-y-auto sm:overflow-y-hidden'
                    : 'overflow-x-hidden overflow-y-auto',
                ].join(' ')}
              >
                <ScreenBody screen={screen} onNavigate={onNavigate} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
