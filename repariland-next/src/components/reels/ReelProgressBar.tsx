'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from 'react';

type ReelProgressBarProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  fallbackDurationSec?: number;
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ReelProgressBar({
  videoRef,
  isActive,
  fallbackDurationSec = 0,
}: ReelProgressBarProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(
    fallbackDurationSec > 0 ? fallbackDurationSec : 0,
  );
  const [scrubbing, setScrubbing] = useState(false);
  const wasPlayingRef = useRef(false);

  const effectiveDuration =
    duration > 0 ? duration : fallbackDurationSec > 0 ? fallbackDurationSec : 0;

  const syncDuration = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    } else if (fallbackDurationSec > 0) {
      setDuration(fallbackDurationSec);
    }
  }, [videoRef, fallbackDurationSec]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    const onTimeUpdate = () => {
      if (scrubbing) return;
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', syncDuration);
    video.addEventListener('loadedmetadata', syncDuration);
    syncDuration();
    onTimeUpdate();

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', syncDuration);
      video.removeEventListener('loadedmetadata', syncDuration);
    };
  }, [videoRef, isActive, scrubbing, syncDuration]);

  useEffect(() => {
    if (!isActive) {
      setScrubbing(false);
      setCurrentTime(0);
    }
  }, [isActive]);

  const seekTo = useCallback(
    (value: number) => {
      const video = videoRef.current;
      if (!video || effectiveDuration <= 0) return;
      const next = Math.min(effectiveDuration, Math.max(0, value));
      video.currentTime = next;
      setCurrentTime(next);
    },
    [videoRef, effectiveDuration],
  );

  const stopBubble = useCallback((e: PointerEvent) => {
    e.stopPropagation();
  }, []);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLInputElement>) => {
      stopBubble(e);
      const video = videoRef.current;
      wasPlayingRef.current = Boolean(video && !video.paused);
      if (video && wasPlayingRef.current) video.pause();
      setScrubbing(true);
    },
    [stopBubble, videoRef],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLInputElement>) => {
      stopBubble(e);
      setScrubbing(false);
      const video = videoRef.current;
      if (video && wasPlayingRef.current) {
        void video.play().catch(() => {});
      }
    },
    [stopBubble, videoRef],
  );

  const progressPct =
    effectiveDuration > 0
      ? Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100))
      : 0;

  return (
    <div
      className="reel-progress pointer-events-auto w-full shrink-0"
      onClick={stopBubble}
      onPointerDown={stopBubble}
      role="group"
      aria-label="Progreso del video"
    >
      <div
        className="reel-progress__inner"
        style={{ ['--reel-progress-pct' as string]: `${progressPct}%` }}
      >
        <input
          type="range"
          className="reel-progress__input"
          min={0}
          max={effectiveDuration > 0 ? effectiveDuration : 1}
          step={0.05}
          value={Math.min(currentTime, effectiveDuration || 0)}
          disabled={effectiveDuration <= 0}
          aria-valuemin={0}
          aria-valuemax={effectiveDuration}
          aria-valuenow={currentTime}
          aria-label="Avance del video"
          onChange={(e) => seekTo(Number(e.target.value))}
          onInput={(e) => seekTo(Number(e.currentTarget.value))}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        <div className="reel-progress__times" aria-hidden>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(effectiveDuration)}</span>
        </div>
      </div>
    </div>
  );
}
