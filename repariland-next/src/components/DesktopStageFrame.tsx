'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import GlobalBackgroundParticles from '@/components/GlobalBackgroundParticles';
import {
  DESKTOP_STAGE_FRAME_NAME,
  DESKTOP_STAGE_HEIGHT,
  DESKTOP_STAGE_MIN_WIDTH,
  DESKTOP_STAGE_WIDTH,
  MOBILE_STAGE_FRAME_NAME,
  MOBILE_STAGE_HEIGHT,
  MOBILE_STAGE_WIDTH,
  desktopStageScale,
  isEmbeddedFrame,
  mobileStageHeight,
  mobileStageScale,
} from '@/lib/desktopStage';

type Mode = 'pending' | 'shell' | 'mobile-shell' | 'app';

/**
 * Escritorio: marco fijo de 1920×1080, escalado al monitor.
 * Móvil (menos de 1024px): ancho de 375px escalado al dispositivo y alto de toda la pantalla,
 * para que el dock y el pie queden en el borde inferior.
 */
export default function DesktopStageFrame({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('pending');
  const [scale, setScale] = useState(1);
  const [mobileHeight, setMobileHeight] = useState(MOBILE_STAGE_HEIGHT);
  const [mobileBottom, setMobileBottom] = useState(0);
  const [wallpaper, setWallpaper] = useState({ x: 0, y: 0, cell: 64 });
  const [veilOn, setVeilOn] = useState(false);
  const [modalScrim, setModalScrim] = useState(false);
  const srcRef = useRef('');

  useLayoutEffect(() => {
    const desktopMq = window.matchMedia(`(min-width: ${DESKTOP_STAGE_MIN_WIDTH}px)`);

    const apply = () => {
      if (isEmbeddedFrame()) {
        document.documentElement.dataset.desktopLock = 'app';
        setMode('app');
        return;
      }
      if (!srcRef.current) {
        srcRef.current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      }
      const desktop = desktopMq.matches;
      const vv = window.visualViewport;
      const viewport = {
        width: vv?.width ?? window.innerWidth,
        height: vv?.height ?? window.innerHeight,
      };
      const nextScale = desktop ? desktopStageScale(viewport) : mobileStageScale(viewport);
      const nextMobileHeight = desktop ? MOBILE_STAGE_HEIGHT : mobileStageHeight(viewport, nextScale);
      const layoutBottomGap = desktop
        ? 0
        : Math.max(0, window.innerHeight - (vv?.offsetTop ?? 0) - viewport.height);
      const stageWidth = desktop ? DESKTOP_STAGE_WIDTH : MOBILE_STAGE_WIDTH;
      const stageHeight = desktop ? DESKTOP_STAGE_HEIGHT : nextMobileHeight;
      document.documentElement.dataset.desktopLock = desktop ? 'shell' : 'mobile-shell';
      setMode(desktop ? 'shell' : 'mobile-shell');
      setScale(nextScale);
      setMobileHeight(nextMobileHeight);
      setMobileBottom(layoutBottomGap);
      setWallpaper({
        x: (viewport.width - stageWidth * nextScale) / 2,
        y: (viewport.height - stageHeight * nextScale) / 2,
        cell: (desktop ? 64 : 48) * nextScale,
      });
    };

    apply();
    desktopMq.addEventListener('change', apply);
    window.addEventListener('resize', apply);
    window.visualViewport?.addEventListener('resize', apply);
    window.visualViewport?.addEventListener('scroll', apply);
    return () => {
      desktopMq.removeEventListener('change', apply);
      window.removeEventListener('resize', apply);
      window.visualViewport?.removeEventListener('resize', apply);
      window.visualViewport?.removeEventListener('scroll', apply);
    };
  }, []);

  useEffect(() => {
    if (mode !== 'shell' && mode !== 'mobile-shell') return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; on?: boolean } | null;
      if (!data) return;
      if (data.type === 'reparilandia-screen-veil') setVeilOn(Boolean(data.on));
      if (data.type === 'reparilandia-modal-scrim') setModalScrim(Boolean(data.on));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'shell' && mode !== 'mobile-shell') return;
    const hideDevIndicator = () => {
      document.querySelectorAll('nextjs-portal').forEach((node) => {
        if (node instanceof HTMLElement) node.remove();
      });
    };
    hideDevIndicator();
    const observer = new MutationObserver(hideDevIndicator);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [mode]);

  if (mode === 'shell' || mode === 'mobile-shell') {
    const mobile = mode === 'mobile-shell';
    return (
      <div
        className="desktop-stage-shell"
        style={{
          ['--stage-grid' as string]: `${wallpaper.cell}px`,
          ['--stage-grid-x' as string]: `${wallpaper.x}px`,
          ['--stage-grid-y' as string]: `${wallpaper.y}px`,
        }}
      >
        <div className="desktop-stage-wallpaper" aria-hidden>
          <div className="desktop-stage-wallpaper__glow" />
          <div className="desktop-stage-wallpaper__flare" />
          <div className="desktop-stage-wallpaper__grid" />
          <div className="desktop-stage-wallpaper__particles">
            <GlobalBackgroundParticles />
          </div>
        </div>
        <div className="desktop-stage-veil" data-on={veilOn ? 'true' : 'false'} aria-hidden />
        <div className="desktop-stage-modal-scrim" data-on={modalScrim ? 'true' : 'false'} aria-hidden />
        <iframe
          name={mobile ? MOBILE_STAGE_FRAME_NAME : DESKTOP_STAGE_FRAME_NAME}
          title="Reparilandia"
          src={srcRef.current || '/'}
          className="desktop-stage-frame"
          allow="autoplay; fullscreen; clipboard-write"
          onLoad={(event) => {
            event.currentTarget.contentWindow?.focus();
          }}
          style={{
            width: mobile ? MOBILE_STAGE_WIDTH : DESKTOP_STAGE_WIDTH,
            height: mobile ? mobileHeight : DESKTOP_STAGE_HEIGHT,
            transform: mobile ? `translateX(-50%) scale(${scale})` : `scale(${scale})`,
            ...(mobile ? { bottom: mobileBottom } : null),
          }}
        />
      </div>
    );
  }

  if (mode === 'pending') {
    return <div className="desktop-stage-pending" aria-hidden />;
  }

  return children;
}
