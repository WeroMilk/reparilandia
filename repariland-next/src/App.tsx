'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { useScreenManager } from './hooks/useScreenManager';
import ScreenManager from './components/ScreenManager';
import AppDock from './components/AppDock';
import GlobalBackgroundParticles from './components/GlobalBackgroundParticles';
import SystemBootLoader from './components/SystemBootLoader';
import { useDockGeometricCapture } from './hooks/useDockGeometricCapture';
import { usePreloadScreenAssets } from './hooks/usePreloadScreenAssets';
import { useVisualViewportLock } from './hooks/useVisualViewportLock';
import { useIsAppMobile } from './hooks/use-mobile';
import { preloadCriticalInicioAssets } from './lib/screenAssets';

const LaserPortal = dynamic(() => import('./components/LaserPortal'), { ssr: false });

export default function App() {
  const { currentScreen, direction, navigateTo, goNext, goPrev } = useScreenManager();
  const [bootScreenVisible, setBootScreenVisible] = useState(true);
  const [dockReady, setDockReady] = useState(false);
  const bootDone = !bootScreenVisible;
  const isMobile = useIsAppMobile();

  useVisualViewportLock();

  const hideBootScreen = useCallback(() => {
    setBootScreenVisible(false);
  }, []);

  useEffect(() => {
    preloadCriticalInicioAssets();
  }, []);

  useDockGeometricCapture(bootDone && dockReady, { navigateTo, goNext, goPrev });
  usePreloadScreenAssets(bootDone, currentScreen);

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
    <div
      className="app-root fixed inset-x-0 top-0 flex h-[100svh] min-h-[100svh] w-full max-w-[100vw] flex-col overflow-hidden bg-[#050508]"
      data-app-ready={bootDone ? 'true' : 'false'}
      style={{
        top: 'var(--app-vv-top, 0px)',
        height: 'var(--app-height, 100svh)',
        maxHeight: 'var(--app-height, 100svh)',
        minHeight: 'var(--app-height, 100svh)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#0a0c12] via-[#050508] to-[#030306]" />
      <div className="pointer-events-none absolute inset-0 z-0 grid-bg opacity-[0.16] lg:opacity-[0.09]" />

      <div className="particle-layer pointer-events-none absolute inset-0 z-0 opacity-[0.72] sm:opacity-[0.82] lg:opacity-[0.88]">
        <GlobalBackgroundParticles />
      </div>

      <div className="scanline-overlay" />

      <div className="relative z-20 flex min-h-0 flex-1 w-full flex-col overflow-hidden safe-pt pointer-events-none">
        <div className="app-canvas relative flex min-h-0 flex-1 flex-col pb-dock-reserve pointer-events-none px-2 lg:px-6 xl:px-10">
          <div className="pointer-events-none relative flex min-h-0 flex-1 flex-col overflow-hidden lg:rounded-t-[1.25rem] lg:border-t lg:border-white/[0.07] lg:bg-transparent lg:shadow-elevateLg">
            <ScreenManager
              currentScreen={currentScreen}
              direction={direction}
              onNavigate={navigateTo}
            />
          </div>
        </div>
      </div>

      {bootDone && isMobile === false ? (
        <LaserPortal screenKey={currentScreen} contentReady={bootDone} />
      ) : null}

      {dockReady &&
        createPortal(
          <div
            data-app-dock
            className="pointer-events-auto fixed inset-x-0 isolate flex justify-center px-2 lg:px-6 xl:px-10"
            style={{ bottom: 'var(--app-bottom-inset, 0px)' }}
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
      {bootScreenVisible ? <SystemBootLoader onExitComplete={hideBootScreen} /> : null}
    </div>
  );
}
