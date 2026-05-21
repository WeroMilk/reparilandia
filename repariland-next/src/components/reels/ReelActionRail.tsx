'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Share2, Volume2, VolumeX } from 'lucide-react';

type ReelActionRailProps = {
  muted: boolean;
  onToggleMute: () => void;
  onShare: () => void;
  shareFeedback?: string | null;
};

export default function ReelActionRail({
  muted,
  onToggleMute,
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
