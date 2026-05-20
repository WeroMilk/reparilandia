'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Share2, Volume2, VolumeX } from 'lucide-react';

type ReelActionRailProps = {
  muted: boolean;
  onToggleMute: () => void;
  likeCount: number;
  liked: boolean;
  likeDisabled: boolean;
  onLike: () => void;
  onShare: () => void;
  shareFeedback?: string | null;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function ReelActionRail({
  muted,
  onToggleMute,
  likeCount,
  liked,
  likeDisabled,
  onLike,
  onShare,
  shareFeedback,
}: ReelActionRailProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="reels-action-rail flex flex-col items-center gap-5"
      initial={false}
    >
      <div className="flex flex-col items-center gap-1">
        <motion.button
          type="button"
          aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition hover:border-white/30 hover:bg-black/55"
          whileTap={reduceMotion ? undefined : { scale: 0.9 }}
        >
          {muted ? (
            <VolumeX className="h-6 w-6" strokeWidth={1.75} />
          ) : (
            <Volume2 className="h-6 w-6" strokeWidth={1.75} />
          )}
        </motion.button>
        <span className="text-[10px] text-white/75">{muted ? 'Silenciado' : 'Sonido'}</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <motion.button
          type="button"
          aria-label={liked ? 'Ya diste like' : 'Dar like'}
          disabled={likeDisabled}
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className={`group flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-md transition disabled:cursor-not-allowed disabled:opacity-55 ${
            liked
              ? 'border-[#ff4d6d]/50 bg-[#ff4d6d]/20 text-[#ff6b8a]'
              : 'border-white/15 bg-black/35 text-white hover:border-white/30 hover:bg-black/50'
          }`}
          whileTap={reduceMotion ? undefined : { scale: 0.9 }}
        >
          <motion.span
            animate={
              liked && !reduceMotion
                ? { scale: [1, 1.35, 1], rotate: [0, -12, 0] }
                : { scale: 1 }
            }
            transition={{ duration: 0.35 }}
          >
            <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} strokeWidth={1.75} />
          </motion.span>
        </motion.button>
        <span className="text-[11px] font-medium tabular-nums text-white/90">
          {formatCount(likeCount)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <motion.button
          type="button"
          aria-label="Compartir reel"
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition hover:border-white/30 hover:bg-black/50"
          whileTap={reduceMotion ? undefined : { scale: 0.9 }}
        >
          <Share2 className="h-5 w-5" strokeWidth={1.75} />
        </motion.button>
        <span className="max-w-[4.5rem] truncate text-[10px] text-white/75">
          {shareFeedback ?? 'Compartir'}
        </span>
      </div>
    </motion.div>
  );
}
