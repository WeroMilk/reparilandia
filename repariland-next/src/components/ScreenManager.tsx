'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InicioScreen from './screens/InicioScreen';
import HistoriaScreen from './screens/HistoriaScreen';
import ServiciosScreen from './screens/ServiciosScreen';
import NoticiasScreen from './screens/NoticiasScreen';
import ContactoScreen from './screens/ContactoScreen';
import type { ScreenName } from '@/types';

interface ScreenManagerProps {
  currentScreen: ScreenName;
  direction: number;
  onNavigate: (screen: ScreenName) => void;
}

const projectionEase = [0.22, 1, 0.36, 1] as const;
const REVEAL_S = 0.34;

const variants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir >= 0 ? 12 : -10,
  }),
  center: {
    opacity: 1,
    y: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir >= 0 ? -8 : 10,
    pointerEvents: 'none' as const,
    transition: { duration: 0.14, ease: 'easeOut' as const },
  }),
};

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    el.scrollLeft = 0;
  }, [currentScreen]);

  return (
    <motion.div
      className="pointer-events-none relative z-[10] flex h-full min-h-0 w-full flex-1 flex-col"
      layout={false}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentScreen}
          ref={scrollRef}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: REVEAL_S * 0.85, ease: projectionEase },
            y: { duration: REVEAL_S, ease: projectionEase },
          }}
          style={{ transformOrigin: '50% 0%' }}
          className="app-content-max pointer-events-none relative flex min-h-0 w-full flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain pb-2 scrollbar-hide [-webkit-overflow-scrolling:touch]"
        >
          <motion.div
            className="pointer-events-auto relative z-[1] flex min-h-0 w-full flex-1 flex-col overflow-hidden"
            layout={false}
          >
            <ScreenBody screen={currentScreen} onNavigate={onNavigate} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
