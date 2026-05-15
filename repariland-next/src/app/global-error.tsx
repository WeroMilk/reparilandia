'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="es">
      <body style={{ backgroundColor: '#050508', color: '#fafafa', margin: 0 }}>
        <div
          className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center font-sans antialiased"
          role="alert"
        >
          <div>
            <h1 className="text-lg font-bold tracking-wide text-cyan-200/90 sm:text-xl">
              Error en la aplicación
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/65">
              No se pudo mostrar la página. Prueba recargar o vuelve más tarde.
            </p>
          </div>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-5 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
