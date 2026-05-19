'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
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
  /** Título para chrome macOS (desktop) y drawer (accesibilidad) */
  windowTitle?: string;
  windowSubtitle?: string;
}

/**
 * Modal adaptativo: bottom sheet iOS (móvil) / ventana centrada macOS (desktop).
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
    if (!open || isMobile !== false) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  const springTransition = reducedMotion
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 380, damping: 32 };

  if (isMobile === undefined) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
        <DrawerContent
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel ?? (windowSubtitle && windowTitle ? `${windowSubtitle}: ${windowTitle}` : windowTitle)}
          className="z-[12000] max-h-[92dvh] border-white/10 bg-[#0a0a0e]/98 px-0 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {windowTitle ? (
            <DrawerTitle className="sr-only">{windowTitle}</DrawerTitle>
          ) : null}
          <div className="native-scroll max-h-[calc(92dvh-2rem)] min-h-0 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="app-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel ?? (windowSubtitle && windowTitle ? `${windowSubtitle}: ${windowTitle}` : windowTitle)}
          className={`fixed inset-0 z-[12000] flex items-center justify-center overflow-hidden p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:p-4 safe-pbDock ${className}`}
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
            className={`relative z-[1] flex max-h-[min(88dvh,calc(100dvh-var(--dock-chrome-height)-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2.5rem))] w-full max-w-[min(96vw,58rem)] min-h-0 items-center justify-center px-1 ${contentClassName}`}
            initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={springTransition}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-full w-full min-h-0 overflow-hidden">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
