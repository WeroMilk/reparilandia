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

export default function App() {
  const { currentScreen, direction, navigateTo, goNext, goPrev } = useScreenManager();
  const [bootScreenVisible, setBootScreenVisible] = useState(true);
  const [dockReady, setDockReady] = useState(false);
  const bootDone = !bootScreenVisible;

  const hideBootScreen = useCallback(() => {
    setBootScreenVisible(false);
  }, []);

  useDockGeometricCapture(bootDone && dockReady, { navigateTo, goNext, goPrev });
  usePreloadScreenAssets(bootDone);

  useEffect(() => {
    setDockReady(true);
  }, []);

  useEffect(() => {
    if (!bootDone) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (currentScreen === 'reels' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        return;
      }
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
  }, [bootDone, currentScreen, goNext, goPrev]);

  return (
    <motion.div
      className="relative flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-[#050508]"
      data-app-ready={bootDone ? 'true' : 'false'}
    >
      <motion.div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#0a0c12] via-[#050508] to-[#030306]" />
      <motion.div className="pointer-events-none absolute inset-0 z-0 grid-bg opacity-[0.16] lg:opacity-[0.09]" />

      <motion.div className="particle-layer pointer-events-none absolute inset-0 z-0 opacity-[0.72] sm:opacity-[0.82] lg:opacity-[0.88]">
        <GlobalBackgroundParticles />
      </motion.div>

      <div className="scanline-overlay" />

      <motion.div
        className="relative z-20 flex min-h-0 flex-1 w-full flex-col overflow-hidden safe-pt pointer-events-none"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div className="app-canvas relative flex min-h-0 flex-1 flex-col pb-dock-reserve pointer-events-none px-2 lg:px-6 xl:px-10">
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
          <motion.div
            data-app-dock
            className="pointer-events-auto fixed inset-x-0 bottom-0 isolate flex justify-center px-2 lg:px-6 xl:px-10"
          >
            <AppDock
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              onPrev={goPrev}
              onNext={goNext}
            />
          </motion.div>,
          document.body,
        )}
      {bootScreenVisible ? <SystemBootLoader onExitComplete={hideBootScreen} /> : null}
    </motion.div>
  );
}
