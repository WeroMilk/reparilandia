'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { ReelItem } from '@/lib/reels/types';
import ReelActionRail from '@/components/reels/ReelActionRail';
import ReelProgressBar from '@/components/reels/ReelProgressBar';

type ReelSlideProps = {
  reel: ReelItem;
  isActive: boolean;
  isScreenActive: boolean;
  muted: boolean;
  onToggleMute: () => void;
};

type VideoOrientation = 'portrait' | 'landscape';

export default function ReelSlide({
  reel,
  isActive,
  isScreenActive,
  muted,
  onToggleMute,
}: ReelSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const reduceMotion = useReducedMotion();
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<VideoOrientation>('portrait');
  const [displayDurationSec, setDisplayDurationSec] = useState(reel.durationSec);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);

  const canPlayback = isActive && isScreenActive && !userPaused;

  const handleVideoMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.videoWidth && video.videoHeight) {
      setOrientation(video.videoHeight >= video.videoWidth ? 'portrait' : 'landscape');
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      if (desktop) {
        // Como máximo el doble del original: estirar un 360p a todo el marco lo ve borroso.
        video.style.maxWidth = `min(100%, ${video.videoWidth * 2}px)`;
        video.style.maxHeight = `min(100%, ${video.videoHeight * 2}px)`;
      } else {
        video.style.maxWidth = '';
        video.style.maxHeight = '';
      }
    }
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDisplayDurationSec(Math.round(video.duration));
    }
  }, []);

  const syncPlayingFromVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(!video.paused && !video.ended);
  }, []);

  useEffect(() => {
    setUserPaused(false);
    setPlaying(false);
    setDisplayDurationSec(reel.durationSec);
  }, [reel.id, reel.durationSec]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isScreenActive || !isActive || !canPlayback) {
      video.pause();
      setPlaying(false);
      if (!isScreenActive) setUserPaused(false);
      return;
    }

    let cancelled = false;
    let unlock: (() => void) | null = null;
    const startPlayback = () => {
      const soundOff = mutedRef.current;
      video.muted = soundOff;
      video.volume = soundOff ? 0 : 1;
      return video.play();
    };

    void startPlayback()
      .then(() => {
        if (!cancelled) setPlaying(true);
      })
      .catch(() => {
        if (cancelled) return;
        unlock = () => {
          void startPlayback()
            .then(() => setPlaying(true))
            .catch(() => setPlaying(false));
        };
        window.addEventListener('pointerdown', unlock, { once: true });
        setPlaying(false);
      });

    return () => {
      cancelled = true;
      if (unlock) window.removeEventListener('pointerdown', unlock);
    };
  }, [isActive, isScreenActive, canPlayback]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.volume = muted ? 0 : 1;
  }, [muted]);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isActive || !isScreenActive) return;

    if (video.paused) {
      setUserPaused(false);
      video.muted = muted;
      video.volume = muted ? 0 : 1;
      void video.play().then(() => {
        setPlaying(true);
        setShowPlayHint(false);
      });
    } else {
      video.pause();
      setUserPaused(true);
      setPlaying(false);
      setShowPlayHint(true);
    }
  }, [isActive, isScreenActive, muted]);

  const handleShare = useCallback(async () => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?reel=${encodeURIComponent(reel.id)}`
        : '';
    const payload = {
      title: reel.title,
      text: reel.caption ?? reel.title,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        setShareFeedback('¡Listo!');
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareFeedback('Copiado');
      } else {
        setShareFeedback('Enlace listo');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setShareFeedback('Error');
    }
    window.setTimeout(() => setShareFeedback(null), 2000);
  }, [reel]);

  const pausedVisible = isActive && isScreenActive && (!playing || userPaused);

  return (
    <article
      className="reels-slide relative h-full w-full shrink-0 snap-start snap-always overflow-hidden bg-black"
      data-reel-id={reel.id}
      aria-label={reel.title}
    >
      <div className="reels-slide__stage relative min-h-0 w-full flex-1">
        <div className="reels-slide__media absolute inset-0 flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={reel.videoUrl}
            poster={reel.posterUrl}
            className={
              orientation === 'portrait'
                ? 'h-full w-auto max-h-full max-w-full object-contain object-center'
                : 'h-auto max-h-full w-full object-contain object-center max-lg:min-w-[min(92vw,100%)] max-lg:w-auto'
            }
            playsInline
            autoPlay={canPlayback}
            loop
            muted={muted}
            preload={isActive ? 'auto' : 'metadata'}
            disablePictureInPicture
            onLoadedMetadata={handleVideoMetadata}
            onPlay={syncPlayingFromVideo}
            onPause={syncPlayingFromVideo}
            onEnded={syncPlayingFromVideo}
          />
        </div>

        {isActive && isScreenActive ? (
          <button
            type="button"
            className="reels-slide__tap absolute inset-0 z-[15] flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 touch-manipulation"
            onClick={togglePlayPause}
            aria-label={playing ? 'Pausar video' : 'Reproducir video'}
          >
            {pausedVisible ? (
              <motion.span
                className="pointer-events-none flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-white/25 bg-black/50 text-white shadow-lg backdrop-blur-sm"
                initial={reduceMotion ? undefined : { scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Play className="ml-1 h-10 w-10 fill-white" strokeWidth={1.5} />
              </motion.span>
            ) : showPlayHint && !reduceMotion ? (
              <motion.span
                className="pointer-events-none flex h-14 w-14 items-center justify-center rounded-full bg-black/35 text-white/90 opacity-0"
                initial={{ opacity: 0.7, scale: 1 }}
                animate={{ opacity: 0, scale: 1.15 }}
                transition={{ duration: 0.45 }}
                onAnimationComplete={() => setShowPlayHint(false)}
              >
                <Pause className="h-8 w-8" strokeWidth={1.75} />
              </motion.span>
            ) : null}
          </button>
        ) : null}

        <div
          className="reels-slide__shade pointer-events-none absolute inset-0 z-[18]"
          aria-hidden
        />

        <div className="reels-slide__chrome pointer-events-none absolute inset-0 z-[30] flex flex-col justify-end">
          <div className="reels-slide__chrome-row flex min-h-0 w-full flex-1 items-end justify-between gap-2 px-4 pb-1 pt-4 sm:px-5 sm:pb-2">
            <div className="pointer-events-none min-w-0 max-w-[78%] space-y-1 sm:max-w-[72%]">
              <h3 className="font-space text-base font-semibold uppercase tracking-wide text-white drop-shadow-md sm:text-lg">
                {reel.title}
              </h3>
              {reel.externalUrl ? (
                <a
                  href={reel.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto inline-flex items-center gap-1 text-sm font-medium text-[#4DA3FF] underline decoration-[#4DA3FF]/50 underline-offset-2 drop-shadow hover:text-[#7bb8ff]"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ver video completo
                </a>
              ) : reel.caption ? (
                <p className="line-clamp-2 text-sm leading-snug text-white/88 drop-shadow">
                  {reel.caption}
                </p>
              ) : null}
              <p className="text-[11px] tabular-nums text-white/55">{displayDurationSec}s · Reparilandia</p>
            </div>

            <div className="reels-slide__actions pointer-events-auto flex shrink-0 flex-col items-center justify-end pr-0 sm:pr-1">
              <ReelActionRail
                muted={muted}
                onToggleMute={onToggleMute}
                onShare={() => void handleShare()}
                shareFeedback={shareFeedback}
              />
            </div>
          </div>

          <ReelProgressBar
            videoRef={videoRef}
            isActive={isActive && isScreenActive}
            fallbackDurationSec={reel.durationSec}
          />
        </div>
      </div>
    </article>
  );
}
