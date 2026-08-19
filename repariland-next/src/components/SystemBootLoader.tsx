import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_MS = 640;
const EXIT_MS = 240;

interface SystemBootLoaderProps {
  onExitComplete: () => void;
}

export default function SystemBootLoader({ onExitComplete }: SystemBootLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const exitNotified = useRef(false);

  const notifyExitComplete = useCallback(() => {
    if (exitNotified.current) return;
    exitNotified.current = true;
    onExitComplete();
  }, [onExitComplete]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const hideId = window.setTimeout(() => setVisible(false), BOOT_MS);
    const safetyId = window.setTimeout(notifyExitComplete, BOOT_MS + EXIT_MS + 80);
    return () => {
      window.clearTimeout(hideId);
      window.clearTimeout(safetyId);
    };
  }, [mounted, notifyExitComplete]);

  if (!mounted) return null;

  return (
    <AnimatePresence onExitComplete={notifyExitComplete}>
      {visible && (
        <motion.div
          key="system-boot"
          id="system-boot-overlay"
          className="pointer-events-none fixed inset-0 z-[10100] flex flex-col items-center justify-center bg-hologram-darker safe-pt"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
        >
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
