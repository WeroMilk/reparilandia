'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useScreenManager } from './hooks/useScreenManager';
import ScreenManager from './components/ScreenManager';
import AppDock from './components/AppDock';
import GlobalBackgroundParticles from './components/GlobalBackgroundParticles';
import SystemBootLoader from './components/SystemBootLoader';
import LaserPortal from './components/LaserPortal';
import { useDockGeometricCapture } from './hooks/useDockGeometricCapture';
import { usePreloadScreenAssets } from './hooks/usePreloadScreenAssets';

/** Arranque del loader (~1200 ms) + salida (~300 ms); si `onExitComplete` falla, evita UI invisible para siempre. */
const BOOT_UI_FALLBACK_MS = 2000;

export default function App() {
  const { currentScreen, direction, navigateTo, goNext, goPrev } = useScreenManager();
  const [bootDone, setBootDone] = useState(false);
  const [dockReady, setDockReady] = useState(false);

  const finishBoot = useCallback(() => setBootDone(true), []);

  useDockGeometricCapture(bootDone && dockReady, { navigateTo, goNext, goPrev });
  usePreloadScreenAssets(bootDone);

  useEffect(() => {
    setDockReady(true);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(finishBoot, BOOT_UI_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, [finishBoot]);

  useEffect(() => {
    if (!bootDone) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bootDone, goNext, goPrev]);

  return (
    <div className="relative flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-[#050508]">
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#0a0c12] via-[#050508] to-[#030306]" />
      <div className="pointer-events-none absolute inset-0 z-0 grid-bg opacity-[0.16] lg:opacity-[0.09]" />

      <div className="particle-layer pointer-events-none absolute inset-0 z-0 opacity-[0.92] lg:opacity-[0.88]">
        <GlobalBackgroundParticles />
      </div>

      <div className="scanline-overlay" />

      <motion.div
        className="relative z-20 flex min-h-0 flex-1 w-full flex-col overflow-hidden safe-pt pointer-events-none"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div className="relative mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col pb-dock-reserve pointer-events-none lg:mx-6 xl:mx-10">
          <motion.div className="pointer-events-none relative flex min-h-0 flex-1 flex-col overflow-hidden lg:rounded-t-[1.25rem] lg:border-t lg:border-white/[0.07] lg:bg-transparent lg:shadow-elevateLg">
            <ScreenManager
              currentScreen={currentScreen}
              direction={direction}
              onNavigate={navigateTo}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <LaserPortal screenKey={currentScreen} contentReady={bootDone} />

      {dockReady &&
        createPortal(
          <div
            data-app-dock
            className="pointer-events-auto fixed inset-x-0 bottom-0 isolate flex justify-center px-2 lg:px-6 xl:px-10"
          >
            <AppDock
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              onPrev={goPrev}
              onNext={goNext}
            />
          </div>,
          document.body,
        )}
      {!bootDone && <SystemBootLoader onExitComplete={finishBoot} />}
    </div>
  );
}
