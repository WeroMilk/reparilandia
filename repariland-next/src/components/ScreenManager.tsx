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

/** Curva rápida y estable en GPU (solo opacity + translate). */
const projectionEase = [0.22, 1, 0.36, 1] as const;

const REVEAL_S = 0.42;

const variants = {
  enter: {
    opacity: 0,
    y: 14,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.16, ease: 'easeOut' as const },
  },
};

export default function ScreenManager({ currentScreen, direction, onNavigate }: ScreenManagerProps) {
  return (
    <div className="relative z-[10] h-full min-h-0 w-full">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentScreen}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: REVEAL_S * 0.92, ease: projectionEase },
            y: { duration: REVEAL_S, ease: projectionEase },
          }}
          style={{ transformOrigin: '50% 0%' }}
          className="absolute inset-0 flex h-full min-h-0 flex-col overflow-hidden will-change-transform"
        >
          <div className="relative z-[3] flex min-h-0 flex-1 flex-col">
            {currentScreen === 'inicio' && <InicioScreen onNavigate={onNavigate} />}
            {currentScreen === 'historia' && <HistoriaScreen />}
            {currentScreen === 'servicios' && <ServiciosScreen />}
            {currentScreen === 'noticias' && <NoticiasScreen />}
            {currentScreen === 'contacto' && <ContactoScreen />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
