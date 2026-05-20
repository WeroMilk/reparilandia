'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MOTION_IOS_SPRING } from '@/lib/motionPresets';

interface CarouselDotsProps {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  className?: string;
}

export default function CarouselDots({ count, active, onSelect, className = '' }: CarouselDotsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`} role="tablist" aria-label="Paginación">
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Ir al elemento ${i + 1} de ${count}`}
            onClick={() => onSelect(i)}
            className="relative flex h-2 min-w-[0.5rem] items-center justify-center touch-manipulation"
          >
            <motion.span
              layout={!reduceMotion}
              className={`block h-2 rounded-full ${
                isActive
                  ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                  : 'bg-white/25 hover:bg-white/45'
              }`}
              animate={{
                width: isActive ? 24 : 8,
                opacity: isActive ? 1 : 0.72,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      width: MOTION_IOS_SPRING,
                      opacity: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
                    }
              }
            />
          </button>
        );
      })}
    </div>
  );
}
