import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ScreenName } from '@/types';

interface LaserPortalProps {
  screenKey: ScreenName;
  /** Al pasar a true la primera vez, pulso de proyección (sincronizado con el reveal del contenido). */
  contentReady?: boolean;
}

type Phase = 'idle' | 'absorb' | 'project';

const ABSORB_MS = 200;
const PROJECT_MS = 420;

/**
 * Haz de reflector en capa de fondo (z-[8]): por debajo del stage (z-20), scanlines (z-12) y dock.
 * Sin mezclarse visualmente con paneles vítreos del contenido (p. ej. Historia sin backdrop-blur fuerte).
 */
export default function LaserPortal({ screenKey, contentReady = false }: LaserPortalProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [cycle, setCycle] = useState(0);
  const prev = useRef<ScreenName | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const introPulseFired = useRef(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (!contentReady || introPulseFired.current) return;
    introPulseFired.current = true;
    setCycle((c) => c + 1);
    setPhase('project');
    const t = setTimeout(() => setPhase('idle'), PROJECT_MS);
    timers.current.push(t);
  }, [contentReady]);

  useEffect(() => {
    if (prev.current === null) {
      prev.current = screenKey;
      return;
    }
    if (prev.current === screenKey) return;
    prev.current = screenKey;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setCycle((c) => c + 1);
    setPhase('absorb');
    timers.current.push(setTimeout(() => setPhase('project'), ABSORB_MS));
    timers.current.push(setTimeout(() => setPhase('idle'), ABSORB_MS + PROJECT_MS));
  }, [screenKey]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[8] overflow-hidden [&_*]:pointer-events-none"
      aria-hidden
    >
      {/* Por debajo del scanline (z-12) y del contenido (z-20) */}
      {/* Haz idle */}
      <motion.div className="absolute inset-0 z-[1] flex justify-center opacity-[0.48] mix-blend-soft-light sm:opacity-[0.44] lg:opacity-[0.38]">
        <div
          className="mt-0 h-[82%] w-full max-w-[42rem] shrink-0"
          style={{
            background:
              'radial-gradient(ellipse 88% 72% at 50% 0%, rgba(240,253,255,0.5) 0%, rgba(45,212,191,0.18) 28%, rgba(34,211,238,0.06) 52%, transparent 78%)',
          }}
        />
      </motion.div>
      <motion.div className="absolute inset-0 z-[1] flex justify-center">
        <div
          className="h-28 w-full max-w-[28rem] shrink-0 rounded-full bg-gradient-to-b from-cyan-100/55 via-teal-200/16 to-transparent blur-xl"
          style={{ marginTop: 0 }}
        />
      </motion.div>

      <div className="relative z-[2] flex w-full justify-center">
        <svg
          className="mt-[-0.35rem] block h-[min(32dvh,9.5rem)] w-full max-w-xl opacity-[0.38] mix-blend-plus-lighter max-sm:opacity-[0.30]"
          viewBox="0 0 320 160"
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <linearGradient id="vol-beam-edge" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="rgba(186,230,253,0.65)" />
              <stop offset="100%" stopColor="rgba(14,165,233,0)" />
            </linearGradient>
          </defs>
          <path d="M 96 36 L 160 154 L 224 36 Z" fill="url(#vol-beam-edge)" opacity={0.52} />
          {[128, 160, 192].map((x, i) => (
            <line
              key={x}
              className="laser-line-shimmer"
              x1={x}
              y1={28}
              x2={160 + (x - 160) * 0.75}
              y2={150}
              stroke="rgba(165,243,252,0.32)"
              strokeWidth={1}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'absorb' && (
          <motion.div
            key={`abs-${cycle}`}
            className="absolute inset-0 z-[28]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            <motion.div
              className="absolute inset-0 bg-black mix-blend-multiply"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.66 }}
              transition={{ duration: ABSORB_MS / 1000, ease: [0.33, 1, 0.68, 1] }}
            />
            <motion.div
              className="absolute inset-0 opacity-90"
              style={{
                mixBlendMode: 'screen',
                transformOrigin: '50% 0%',
                background:
                  'radial-gradient(ellipse 78% 62% at 50% 2%, rgba(56,189,248,0.38) 0%, rgba(34,211,238,0.08) 45%, transparent 62%)',
              }}
              initial={{ scaleY: 0.92, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: ABSORB_MS / 1000, ease: [0.33, 1, 0.68, 1] }}
            />
          </motion.div>
        )}

        {phase === 'project' && (
          <div key={`prj-${cycle}`} className="absolute inset-0 z-[29] flex justify-center">
            {/* Destello: gradientes centrados en 50% (sin trazo cuñado a la derecha) */}
            <motion.div
              className="relative h-full w-full max-w-[42rem] shrink-0 px-2 sm:px-0"
              style={{ transformOrigin: 'top center' }}
              initial={{ scaleY: 0.08, opacity: 0 }}
              animate={{ scaleY: 1, opacity: [0, 0.52, 0.38, 0] }}
              transition={{
                scaleY: {
                  duration: PROJECT_MS / 1000,
                  ease: [0.25, 0.1, 0.25, 1],
                },
                opacity: {
                  duration: PROJECT_MS / 1000,
                  ease: [0.33, 1, 0.68, 1],
                  times: [0, 0.22, 0.58, 1],
                },
              }}
            >
              <div
                className="h-full w-full"
                style={{
                  background: [
                    'radial-gradient(ellipse 82% 90% at 50% 4%, rgba(56,189,248,0.42) 0%, rgba(34,211,238,0.12) 42%, transparent 76%)',
                    'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(190,242,255,0.14) 32%, rgba(45,212,191,0.08) 52%, transparent 90%)',
                  ].join(','),
                }}
              />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-0 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.65, 0.45, 0] }}
              transition={{
                duration: PROJECT_MS / 1000,
                ease: [0.33, 1, 0.68, 1],
                times: [0, 0.2, 0.55, 1],
              }}
            >
              <div
                className="h-full w-full max-w-[42rem] shrink-0"
                style={{
                  mixBlendMode: 'screen',
                  transformOrigin: 'top center',
                  background:
                    'radial-gradient(ellipse 78% 88% at 50% 4%, rgba(186,230,253,0.42) 0%, rgba(45,212,191,0.18) 48%, transparent 78%)',
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'project' && (
          <div key={`rim-wrap-${cycle}`} className="absolute inset-x-0 top-0 z-[30] flex justify-center">
            <motion.div
              key={`rim-${cycle}`}
              className="h-16 w-full max-w-[22rem] rounded-full border border-cyan-200/35 bg-cyan-200/5 shadow-[0_0_48px_rgba(34,211,238,0.28)] mix-blend-screen"
              initial={{ scale: 0.5, opacity: 0.65, y: -4 }}
              animate={{ scale: 1.08, opacity: 0, y: 6 }}
              transition={{ duration: PROJECT_MS / 1000, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
