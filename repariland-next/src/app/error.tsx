'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-[#050508] px-6 text-center text-[#fafafa]"
      role="alert"
    >
      <div>
        <h1 className="font-orbitron text-lg tracking-[0.2em] text-cyan-200/90 sm:text-xl">
          Algo salió mal
        </h1>
        <p className="mt-3 max-w-md font-space text-sm text-white/65">
          Ocurrió un error al cargar esta pantalla. Puedes reintentar o volver al inicio.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-5 py-2.5 font-space text-sm font-semibold text-cyan-50 shadow-[0_0_24px_-8px_rgba(34,211,238,0.35)] transition-colors hover:bg-cyan-500/25"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-xl border border-white/15 bg-white/[0.06] px-5 py-2.5 font-space text-sm font-semibold text-white/90 transition-colors hover:bg-white/[0.1]"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
