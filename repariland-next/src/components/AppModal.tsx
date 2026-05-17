'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

const backdropClass =
  'absolute inset-0 bg-black/55 backdrop-blur-xl supports-[backdrop-filter]:bg-black/40';

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Clases extra en el contenedor fijo (padding, alineación) */
  className?: string;
  /** Clases en el contenedor del panel (p. ej. desplazamiento vertical) */
  contentClassName?: string;
  ariaLabel?: string;
}

/**
 * Modal a nivel de viewport (portal en body): cubre dock y contenido con blur real detrás.
 */
export default function AppModal({
  open,
  onClose,
  children,
  className = '',
  contentClassName = '',
  ariaLabel,
}: AppModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="app-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className={`fixed inset-0 z-[12000] flex items-center justify-center overflow-hidden p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:p-4 safe-pbDock ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={backdropClass}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={`relative z-[1] flex max-h-full w-full min-h-0 items-center justify-center ${contentClassName}`}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
