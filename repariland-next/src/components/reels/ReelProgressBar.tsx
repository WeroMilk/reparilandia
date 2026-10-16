'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
  type SyntheticEvent,
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
  const [duration, setDuration] = useState(
    fallbackDurationSec > 0 ? fallbackDurationSec : 0,
  );
  const wasPlayingRef = useRef(false);
  const scrubbingRef = useRef(false);
  const durationRef = useRef(duration);
  const innerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentLabelRef = useRef<HTMLSpanElement>(null);

  const effectiveDuration =
    duration > 0 ? duration : fallbackDurationSec > 0 ? fallbackDurationSec : 0;

  useEffect(() => {
    durationRef.current = effectiveDuration;
  }, [effectiveDuration]);

  const paintProgress = useCallback((time: number) => {
    const total = durationRef.current;
    const pct = total > 0 ? Math.min(100, Math.max(0, (time / total) * 100)) : 0;
    innerRef.current?.style.setProperty('--reel-progress-pct', `${pct}%`);
    if (inputRef.current) inputRef.current.value = String(time);
    if (currentLabelRef.current) currentLabelRef.current.textContent = formatTime(time);
  }, []);

  const syncDuration = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const fromVideo = video.duration;
    if (Number.isFinite(fromVideo) && fromVideo > 0) {
      setDuration(fromVideo);
      return;
    }
    if (fallbackDurationSec > 0) {
      setDuration(fallbackDurationSec);
    }
  }, [videoRef, fallbackDurationSec]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    const onTimeUpdate = () => {
      if (scrubbingRef.current) return;
      paintProgress(video.currentTime);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', syncDuration);
    video.addEventListener('loadedmetadata', syncDuration);
    video.addEventListener('loadeddata', syncDuration);
    video.addEventListener('canplay', syncDuration);
    syncDuration();
    onTimeUpdate();

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', syncDuration);
      video.removeEventListener('loadedmetadata', syncDuration);
      video.removeEventListener('loadeddata', syncDuration);
      video.removeEventListener('canplay', syncDuration);
    };
  }, [videoRef, isActive, syncDuration, paintProgress]);

  useEffect(() => {
    if (!isActive) {
      scrubbingRef.current = false;
      paintProgress(0);
    }
  }, [isActive, paintProgress]);

  const seekTo = useCallback(
    (value: number) => {
      const video = videoRef.current;
      if (!video || effectiveDuration <= 0) return;
      const next = Math.min(effectiveDuration, Math.max(0, value));
      video.currentTime = next;
      paintProgress(next);
    },
    [videoRef, effectiveDuration],
  );

  const stopBubble = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLInputElement>) => {
      stopBubble(e);
      const video = videoRef.current;
      wasPlayingRef.current = Boolean(video && !video.paused);
      if (video && wasPlayingRef.current) video.pause();
      scrubbingRef.current = true;
    },
    [stopBubble, videoRef],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLInputElement>) => {
      stopBubble(e);
      scrubbingRef.current = false;
      const video = videoRef.current;
      if (video && wasPlayingRef.current) {
        void video.play().catch(() => {});
      }
    },
    [stopBubble, videoRef],
  );

  return (
    <div
      className="reel-progress pointer-events-auto w-full shrink-0"
      onClick={stopBubble}
      onPointerDown={stopBubble}
      role="group"
      aria-label="Progreso del video"
    >
      <div ref={innerRef} className="reel-progress__inner">
        <input
          ref={inputRef}
          type="range"
          className="reel-progress__input"
          min={0}
          max={effectiveDuration > 0 ? effectiveDuration : 1}
          step={0.05}
          defaultValue={0}
          disabled={effectiveDuration <= 0}
          aria-valuemin={0}
          aria-valuemax={effectiveDuration}
          aria-label="Avance del video"
          onChange={(e) => seekTo(Number(e.target.value))}
          onInput={(e) => seekTo(Number(e.currentTarget.value))}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        <div className="reel-progress__times" aria-hidden>
          <span ref={currentLabelRef}>0:00</span>
          <span>{formatTime(effectiveDuration)}</span>
        </div>
      </div>
    </div>
  );
}
