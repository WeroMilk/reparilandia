'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { ReelItem } from '@/lib/reels/types';
import ReelActionRail from '@/components/reels/ReelActionRail';

type ReelSlideProps = {
  reel: ReelItem;
  isActive: boolean;
  isScreenActive: boolean;
};

type VideoOrientation = 'portrait' | 'landscape';

export default function ReelSlide({
  reel,
  isActive,
  isScreenActive,
}: ReelSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<VideoOrientation>('portrait');
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);

  const canPlayback = isActive && isScreenActive && !userPaused;

  const handleVideoMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video?.videoWidth || !video?.videoHeight) return;
    setOrientation(video.videoHeight >= video.videoWidth ? 'portrait' : 'landscape');
  }, []);

  const syncPlayingFromVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(!video.paused && !video.ended);
  }, []);

  useEffect(() => {
    setUserPaused(false);
    setPlaying(false);
  }, [reel.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isScreenActive) {
      video.pause();
      video.muted = true;
      setMuted(true);
      setPlaying(false);
      setUserPaused(false);
      return;
    }

    if (!isActive) {
      video.pause();
      setPlaying(false);
      return;
    }

    if (canPlayback) {
      void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [isActive, isScreenActive, canPlayback]);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isActive || !isScreenActive) return;

    if (video.paused) {
      setUserPaused(false);
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
  }, [isActive, isScreenActive]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    setMuted((prev) => {
      const next = !prev;
      if (video) video.muted = next;
      return next;
    });
  }, []);

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
            loop
            muted={muted}
            preload={isActive ? 'auto' : 'metadata'}
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
          className="pointer-events-none absolute inset-0 z-[18] bg-gradient-to-b from-black/30 via-transparent to-black/80"
          aria-hidden
        />

        <div className="reels-slide__chrome pointer-events-none absolute inset-0 z-[25] flex">
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col justify-end p-4 sm:p-5">
            <div className="pointer-events-none max-w-[78%] space-y-1 sm:max-w-[72%]">
              <h3 className="font-space text-base font-semibold uppercase tracking-wide text-white drop-shadow-md sm:text-lg">
                {reel.title}
              </h3>
              {reel.caption ? (
                <p className="line-clamp-2 text-sm leading-snug text-white/88 drop-shadow">
                  {reel.caption}
                </p>
              ) : null}
              <p className="text-[11px] tabular-nums text-white/55">{reel.durationSec}s · Reparilandia</p>
            </div>
          </div>

          <div className="pointer-events-auto flex shrink-0 flex-col items-center justify-end pr-3 sm:pr-4">
            <ReelActionRail
              muted={muted}
              onToggleMute={toggleMute}
              onShare={() => void handleShare()}
              shareFeedback={shareFeedback}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
