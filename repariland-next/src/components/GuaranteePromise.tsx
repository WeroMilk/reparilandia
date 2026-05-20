import { ShieldCheck } from 'lucide-react';

type GuaranteePromiseProps = {
  variant?: 'default' | 'compact';
  className?: string;
};

/**
 * Mensaje de garantía / confianza — visible en pantallas clave.
 */
export default function GuaranteePromise({ variant = 'default', className = '' }: GuaranteePromiseProps) {
  if (variant === 'compact') {
    return (
      <aside
        className={`guarantee-promise guarantee-promise--compact flex items-center justify-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/[0.07] px-2.5 py-1.5 text-center shadow-[0_0_20px_rgba(52,211,153,0.1)] ring-1 ring-inset ring-emerald-400/15 ${className}`}
        aria-label="Compromiso de garantía Reparilandia"
      >
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-300" strokeWidth={2} aria-hidden />
        <p className="font-space text-[10px] font-medium leading-snug text-emerald-50/95 sm:text-[11px]">
          <span className="font-semibold text-emerald-200">Garantía sin fricciones:</span>{' '}
          nos hacemos cargo de todo. Sin mal sabor de boca — solo confianza.
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={`guarantee-promise mx-auto w-full max-w-xl rounded-xl border border-emerald-400/35 bg-gradient-to-b from-emerald-500/[0.12] to-emerald-950/20 px-3 py-2.5 text-center shadow-[0_0_28px_rgba(52,211,153,0.14)] ring-1 ring-inset ring-emerald-400/20 sm:max-w-2xl sm:px-4 sm:py-3 lg:max-w-[42rem] ${className}`}
      aria-label="Compromiso de garantía Reparilandia"
    >
      <div className="mb-1 flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" strokeWidth={2} aria-hidden />
        <p className="font-orbitron text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200/95 sm:text-[11px] sm:tracking-[0.26em]">
          Garantía Reparilandia
        </p>
      </div>
      <p className="font-orbitron text-[clamp(0.6875rem,2.6vw,0.8125rem)] font-semibold leading-snug tracking-[0.06em] text-white sm:text-sm">
        La garantía con nosotros no es un problema: es nuestro estándar.
      </p>
      <p className="mt-1 font-space text-[11px] leading-snug text-white/82 sm:text-xs sm:leading-relaxed">
        Cada reparación queda respaldada de principio a fin. Si algo no cumple, nos hacemos cargo de todo — para
        que nunca te lleves un mal sabor de boca, solo la tranquilidad de haber elegido bien.
      </p>
    </aside>
  );
}
