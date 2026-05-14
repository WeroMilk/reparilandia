import { useMemo, type CSSProperties } from 'react';
import { useParticleBudget } from '@/hooks/useMotionPreferences';

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

const colorClasses = [
  'bg-hologram-cyan',
  'bg-cyan-400',
  'bg-sky-400',
  'bg-cyan-300',
  'bg-hologram-blue',
  'bg-blue-500',
  'bg-blue-600',
  'bg-hologram-gold',
  'bg-yellow-400',
  'bg-yellow-300',
  'bg-amber-400',
  'bg-lime-400',
  'bg-lime-300',
  'bg-emerald-400',
  'bg-green-400',
  'bg-teal-400',
  'bg-rose-500',
  'bg-red-500',
  'bg-red-400',
  'bg-orange-500',
  'bg-orange-400',
  'bg-pink-500',
  'bg-pink-400',
  'bg-fuchsia-500',
  'bg-fuchsia-400',
  'bg-purple-500',
  'bg-violet-500',
  'bg-violet-400',
] as const;

export default function GlobalBackgroundParticles() {
  const { ready, count: particleCount } = useParticleBudget();

  const particles = useMemo(() => {
    if (!ready || particleCount <= 0) return [];
    return Array.from({ length: particleCount }, (_, i) => {
      const useRand = i % 3 !== 0;
      let left: number;
      let top: number;
      if (useRand) {
        left = 1 + seeded(i, 1) * 97;
        top = 1 + seeded(i, 2) * 97;
      } else {
        const cols = Math.min(26, Math.ceil(Math.sqrt(particleCount * 1.15)));
        const rows = Math.ceil(particleCount / cols);
        const col = i % cols;
        const row = Math.floor(i / cols) % rows;
        const jitterX = (seeded(i, 11) - 0.5) * 14;
        const jitterY = (seeded(i, 12) - 0.5) * 14;
        left = Math.min(99, Math.max(0.25, (col / Math.max(1, cols - 1)) * 97 + jitterX));
        top = Math.min(99, Math.max(0.25, (row / Math.max(1, rows - 1)) * 97 + jitterY));
      }
      const colorIdx = Math.floor(seeded(i, 3) * colorClasses.length);
      const sizePx = 0.4 + seeded(i, 4) * 2.1;
      const opacityBase = 0.2 + seeded(i, 5) * 0.36;
      return {
        key: i,
        left: `${left}%`,
        top: `${top}%`,
        colorClass: colorClasses[colorIdx],
        sizePx,
        opacityLow: opacityBase * 0.55,
        opacityHigh: opacityBase * 1.02,
        duration: 1.6 + seeded(i, 6) * 3.4,
        delay: seeded(i, 7) * 5,
      };
    });
  }, [ready, particleCount]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 transform-gpu overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.key}
          className={`particle-twinkle absolute rounded-full ${p.colorClass}`}
          style={
            {
              left: p.left,
              top: p.top,
              width: p.sizePx,
              height: p.sizePx,
              '--p-lo': p.opacityLow,
              '--p-hi': p.opacityHigh,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
