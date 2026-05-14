import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_MS = 1200;

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

interface SystemBootLoaderProps {
  onExitComplete: () => void;
}

export default function SystemBootLoader({ onExitComplete }: SystemBootLoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), BOOT_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="system-boot"
          className="fixed inset-0 z-[10100] flex flex-col items-center justify-center bg-hologram-darker safe-pt"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="absolute inset-0 grid-bg opacity-[0.18] pointer-events-none" />
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${5 + seeded(i, 1) * 90}%`,
                top: `${5 + seeded(i, 2) * 90}%`,
                width: 2 + seeded(i, 3) * 3,
                height: 2 + seeded(i, 3) * 3,
                opacity: 0.25 + seeded(i, 4) * 0.45,
                background:
                  seeded(i, 5) < 0.33
                    ? '#00BFFF'
                    : seeded(i, 5) < 0.66
                      ? '#FFD700'
                      : '#0077FF',
                boxShadow: '0 0 6px rgba(0,191,255,0.45)',
              }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center gap-4 px-6">
            <div className="boot-spinner-ring flex h-16 w-16 items-center justify-center rounded-full border-2 border-hologram-cyan/35 border-t-hologram-cyan">
              <div className="w-2 h-2 rounded-full bg-hologram-cyan shadow-[0_0_12px_rgba(0,191,255,0.8)]" />
            </div>
            <p className="font-space text-hologram-cyan text-sm sm:text-base font-medium tracking-[0.16em] text-center">
              CARGANDO SISTEMA…
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
