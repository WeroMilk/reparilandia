'use client';

import { motion } from 'framer-motion';
import { Film, Settings2 } from 'lucide-react';

type ReelsEmptyStateProps = {
  onOpenAdmin?: () => void;
  storage: 'blob' | 'static' | null;
};

export default function ReelsEmptyState({ onOpenAdmin, storage }: ReelsEmptyStateProps) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 px-6 text-center">
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_40px_-12px_rgba(0,119,255,0.55)]"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Film className="h-8 w-8 text-[#4DA3FF]" strokeWidth={1.5} />
      </motion.div>
      <motion.div
        className="max-w-xs space-y-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h2 className="font-space text-lg font-semibold uppercase tracking-[0.2em] text-white">
          REELS
        </h2>
        <p className="text-sm leading-relaxed text-white/62">
          Pronto verás aquí los mejores momentos del taller. Máximo 5 videos de 30 segundos.
        </p>
        <p className="text-xs text-white/45">
          Añade videos con:{' '}
          <span className="font-mono text-[10px] text-white/65">npm run reels:add -- --file ... --title ...</span>
        </p>
      </motion.div>
      {onOpenAdmin ? (
        <button
          type="button"
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-2 rounded-full border border-[#0077FF]/40 bg-[#0077FF]/15 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#7ec8ff] transition hover:bg-[#0077FF]/25"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Administrar reels
        </button>
      ) : null}
    </div>
  );
}
