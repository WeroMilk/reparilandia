'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';

type WindowChromeProps = {
  title?: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * Panel con barra superior estilo ventana macOS (lg+). Traffic lights decorativos.
 */
export default function WindowChrome({
  title,
  subtitle,
  onClose,
  children,
  className = '',
}: WindowChromeProps) {
  return (
    <div
      className={`flex max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[var(--radius-window)] border border-white/[0.1] bg-[#0a0a0e]/95 shadow-elevateLg backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0e]/88 ${className}`}
    >
      <header className="hidden shrink-0 items-center gap-3 border-b border-white/[0.08] px-4 py-2.5 lg:flex">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]" />
        </div>
        {(title || subtitle) && (
          <div className="min-w-0 flex-1 text-center">
            {subtitle ? (
              <p className="truncate font-space text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {subtitle}
              </p>
            ) : null}
            {title ? (
              <p className="truncate font-orbitron text-sm tracking-[0.12em] text-cyan-300/95">{title}</p>
            ) : null}
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
