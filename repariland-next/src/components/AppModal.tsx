'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useIsAppMobile } from '@/hooks/use-mobile';

const backdropClass =
  'absolute inset-0 bg-black/55 backdrop-blur-xl supports-[backdrop-filter]:bg-black/40';

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  ariaLabel?: string;
  /** Título para chrome macOS (desktop) y accesibilidad en móvil */
  windowTitle?: string;
  windowSubtitle?: string;
}

/**
 * Modal adaptativo: ventana centrada con scroll (móvil y desktop), respetando el dock.
 */
export default function AppModal({
  open,
  onClose,
  children,
  className = '',
  contentClassName = '',
  ariaLabel,
  windowTitle,
  windowSubtitle,
}: AppModalProps) {
  const isMobile = useIsAppMobile();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const springTransition = reducedMotion
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 380, damping: 32 };

  if (isMobile === undefined) return null;
  if (typeof document === 'undefined') return null;

  const dialogLabel =
    ariaLabel ?? (windowSubtitle && windowTitle ? `${windowSubtitle}: ${windowTitle}` : windowTitle);

  const overlayPadding = isMobile
    ? 'px-2 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[calc(var(--dock-chrome-height)+env(safe-area-inset-bottom,0px)+0.375rem)]'
    : 'p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:p-4 safe-pbDock';

  const panelMaxWidth = isMobile ? 'max-w-[min(100%,28rem)]' : 'max-w-[min(96vw,58rem)]';

  const panelMaxHeight =
    'max-h-[min(88dvh,calc(100dvh-var(--dock-chrome-height)-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.25rem))]';

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="app-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={dialogLabel}
          className={`fixed inset-0 z-[12000] flex items-center justify-center overflow-hidden ${overlayPadding} ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={springTransition}
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
            className={`relative z-[1] flex ${panelMaxHeight} w-full ${panelMaxWidth} min-h-0 items-center justify-center ${contentClassName}`}
            initial={reducedMotion ? false : { opacity: 0, y: isMobile ? 10 : 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={springTransition}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-full min-h-0 ${
                isMobile
                  ? `native-scroll ${panelMaxHeight} overflow-y-auto overscroll-contain`
                  : 'max-h-full overflow-hidden'
              }`}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
