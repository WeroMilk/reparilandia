'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import InicioScreen from './screens/InicioScreen';
import { SCREEN_ORDER } from '@/hooks/useScreenManager';
import type { ScreenName } from '@/types';
import { getScreenEnterMotion, MOTION_IOS_EASE_OUT, SCREEN_LAYER_TRANSITION } from '@/lib/motionPresets';
import { useIsMobile } from '@/hooks/use-mobile';

const HistoriaScreen = dynamic(() => import('./screens/HistoriaScreen'), {
  loading: () => null,
});
const ServiciosScreen = dynamic(() => import('./screens/ServiciosScreen'));
const NoticiasScreen = dynamic(() => import('./screens/NoticiasScreen'));
const ReelsScreen = dynamic(() => import('./screens/ReelsScreen'));
const ContactoScreen = dynamic(() => import('./screens/ContactoScreen'));

/** Pantallas caras de remount: se quedan vivas tras la primera visita. */
const KEEP_ALIVE_SCREENS = new Set<ScreenName>(['inicio', 'historia']);

const MOBILE_SCREEN_LAYER_TRANSITION = {
  opacity: { duration: 0.22, ease: MOTION_IOS_EASE_OUT },
};

/** Tras cambiar de pestaña, desmontar la anterior (menos hooks/RO/imágenes en segundo plano). */
const UNMOUNT_DELAY_MS = 280;

interface ScreenManagerProps {
  currentScreen: ScreenName;
  direction: number;
  onNavigate: (screen: ScreenName) => void;
}

function ScreenBody({
  screen,
  onNavigate,
  isScreenActive,
}: {
  screen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  isScreenActive: boolean;
}) {
  switch (screen) {
    case 'inicio':
      return <InicioScreen onNavigate={onNavigate} isScreenActive={isScreenActive} />;
    case 'historia':
      return <HistoriaScreen isScreenActive={isScreenActive} />;
    case 'servicios':
      return <ServiciosScreen isScreenActive={isScreenActive} />;
    case 'noticias':
      return <NoticiasScreen isScreenActive={isScreenActive} />;
    case 'reels':
      return <ReelsScreen isScreenActive={isScreenActive} />;
    case 'contacto':
      return <ContactoScreen isScreenActive={isScreenActive} />;
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
  const isMobile = useIsMobile();
  const [mountedScreens, setMountedScreens] = useState<Set<ScreenName>>(
    () => new Set([currentScreen]),
  );
  const visitedRef = useRef<Set<ScreenName>>(new Set([currentScreen]));
  const prevScreenRef = useRef(currentScreen);

  useEffect(() => {
    visitedRef.current.add(currentScreen);
    setMountedScreens((prev) => {
      if (prev.has(currentScreen)) return prev;
      const next = new Set(prev);
      next.add(currentScreen);
      return next;
    });
  }, [currentScreen]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const keep = new Set<ScreenName>([currentScreen]);
      for (const s of visitedRef.current) {
        if (KEEP_ALIVE_SCREENS.has(s)) keep.add(s);
      }
      setMountedScreens(keep);
    }, UNMOUNT_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [currentScreen]);

  /* Precarga Historia en idle: evita el “lag” del dynamic import al primer toque. */
  useEffect(() => {
    let cancelled = false;
    let timeoutId = 0;
    let idleId = 0;
    const load = () => {
      if (!cancelled) void import('./screens/HistoriaScreen');
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(load, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(load, 600);
    }
    return () => {
      cancelled = true;
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const isScreenEntering = currentScreen !== prevScreenRef.current;
  useEffect(() => {
    prevScreenRef.current = currentScreen;
  }, [currentScreen]);

  const layerTransition = reduceMotion
    ? { opacity: { duration: 0 } }
    : isMobile
      ? MOBILE_SCREEN_LAYER_TRANSITION
      : SCREEN_LAYER_TRANSITION;

  return (
    <div className="pointer-events-none relative z-[10] flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="app-content-max relative flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        {SCREEN_ORDER.filter((screen) => mountedScreens.has(screen)).map((screen) => {
          const active = screen === currentScreen;
          const enterMotion = getScreenEnterMotion(direction, reduceMotion, isMobile);

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
              <div className="pointer-events-auto relative flex min-h-0 w-full flex-1 flex-col overflow-hidden">
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
                  <ScreenBody screen={screen} onNavigate={onNavigate} isScreenActive={active} />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
