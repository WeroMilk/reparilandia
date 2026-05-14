'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScreenManager } from './hooks/useScreenManager';
import ScreenManager from './components/ScreenManager';
import Navigation from './components/Navigation';
import FooterLegal from './components/FooterLegal';
import GlobalBackgroundParticles from './components/GlobalBackgroundParticles';
import SystemBootLoader from './components/SystemBootLoader';
import LaserPortal from './components/LaserPortal';

/** Arranque del loader (~1200 ms) + salida (~300 ms); si `onExitComplete` falla, evita UI invisible para siempre. */
const BOOT_UI_FALLBACK_MS = 2000;

export default function App() {
  const { currentScreen, direction, navigateTo, goNext, goPrev } = useScreenManager();
  const [bootDone, setBootDone] = useState(false);

  const finishBoot = useCallback(() => setBootDone(true), []);

  useEffect(() => {
    const id = window.setTimeout(finishBoot, BOOT_UI_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, [finishBoot]);

  return (
    <div className="relative flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-[#050508]">
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#0a0c12] via-[#050508] to-[#030306]" />
      <div className="pointer-events-none absolute inset-0 z-0 grid-bg opacity-[0.16] lg:opacity-[0.09]" />

      <div className="particle-layer pointer-events-none absolute inset-0 z-0 opacity-[0.92] lg:opacity-[0.88]">
        <GlobalBackgroundParticles />
      </div>

      <div className="scanline-overlay" />

      <motion.div
        className="relative z-10 flex min-h-0 flex-1 w-full flex-col safe-pt"
        initial={false}
        animate={{ opacity: bootDone ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ pointerEvents: bootDone ? 'auto' : 'none' }}
      >
        <div className="min-h-0 flex-1 w-full overflow-hidden lg:px-6 xl:px-10">
          <div className="relative mx-auto h-full w-full max-w-[1440px] overflow-hidden lg:rounded-t-[1.25rem] lg:border lg:border-white/[0.07] lg:bg-white/[0.015] lg:shadow-elevateLg">
            <ScreenManager
              currentScreen={currentScreen}
              direction={direction}
              onNavigate={navigateTo}
            />
          </div>
        </div>

        <div className="dock-chrome relative z-30 flex w-full shrink-0 flex-col border-t border-white/[0.07] bg-[#0c0c10]/92 shadow-dock backdrop-blur-xl supports-[backdrop-filter]:bg-[#0c0c10]/76 safe-pbDock lg:mx-6 lg:mb-3 lg:max-w-[1440px] lg:self-center lg:rounded-2xl lg:border lg:border-white/[0.08] lg:px-2 xl:mx-10">
          <Navigation
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            onPrev={goPrev}
            onNext={goNext}
          />
          <FooterLegal />
        </div>
      </motion.div>

      <LaserPortal screenKey={currentScreen} contentReady={bootDone} />
      {!bootDone && <SystemBootLoader onExitComplete={finishBoot} />}
    </div>
  );
}
