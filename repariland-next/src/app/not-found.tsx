import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-[#050508] px-6 text-center text-[#fafafa]">
      <div>
        <p className="font-orbitron text-xs tracking-[0.35em] text-white/45">404</p>
        <h1 className="mt-2 font-orbitron text-xl tracking-wide text-cyan-200/90 sm:text-2xl">
          Página no encontrada
        </h1>
        <p className="mt-3 max-w-md font-space text-sm text-white/65">
          La ruta que buscas no existe en Reparilandia.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-5 py-2.5 font-space text-sm font-semibold text-cyan-50 shadow-[0_0_24px_-8px_rgba(34,211,238,0.35)] transition-colors hover:bg-cyan-500/25"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
