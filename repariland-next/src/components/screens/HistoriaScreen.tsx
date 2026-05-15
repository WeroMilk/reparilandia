import { motion } from 'framer-motion';
import { assetUrl } from '@/lib/assetUrl';

const milestones = [
  { year: '1985', text: 'Don Jaime abre el taller con una caja de herramientas y un sueño.' },
  { year: '2000', text: 'Carlos se une al negocio familiar, trayendo visión creativa.' },
  { year: '2010', text: 'El taller evoluciona: coleccionismo y museo.' },
  { year: '2026', text: 'Dos generaciones, una pasión por reparar el pasado.' },
];

const storyPanel2 =
  'Este es Carlos: la cara creativa del equipo. Llegó para convertir el taller en un lugar donde cada pieza cuenta una historia. Su energía impulsó la parte museística y el cariño por lo retro.';

const storyPanel3 =
  'El guardián del sombrero representa la paciencia del maestro artesano: detalle fino, pulido y esmero en cada tornillo. Para él, ningún equipo es “solo metal”: todo tiene alma que vale la pena recuperar.';

const storyPanel4 =
  'Con lentes y una sonrisa tranquila, este personaje encarna el lado técnico-claro: diagnósticos honestos y explicaciones que cualquiera puede entender. Reparar bien también es comunicar bien.';

/** Paneles opacos + borde azul tipo crayola / azure. */
const historiaPanel =
  'border border-[#41d9ff]/40 bg-black shadow-[0_0_32px_-16px_rgba(65,217,255,0.14)] ring-1 ring-inset ring-[#41d9ff]/14';

/** Halo minimalista detrás de las caricaturas (azure crayola). */
function HistoriaCharacterGlow({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-[50%] z-0 aspect-[4/5] w-[min(100%,18.5rem)] max-w-[18.5rem] -translate-x-1/2 -translate-y-1/2 rounded-[48%] bg-[#41d9ff]/18 blur-[48px] sm:top-[48%] sm:w-[min(102%,19.5rem)] lg:top-[46%] lg:w-[min(108%,21rem)] lg:max-w-none xl:w-[min(112%,23rem)] ${className}`}
    />
  );
}

function CutoutCharacter({
  src,
  alt,
  className = '',
  imgClassName = '',
  bare = false,
  knockOutWhiteBackdrop = false,
  align = 'center',
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Sin panel detrás: PNG con transparencia real. */
  bare?: boolean;
  /** Fusiona rectángulos blancos del PNG con el fondo oscuro (solo el fondo plano). */
  knockOutWhiteBackdrop?: boolean;
  /** Alineación del recorte dentro del contenedor. */
  align?: 'center' | 'end' | 'start';
}) {
  const wrap = bare
    ? 'bg-transparent'
    : knockOutWhiteBackdrop
      ? 'bg-hologram-darker ring-0'
      : 'bg-white/[0.06] ring-1 ring-inset ring-white/[0.12]';

  const imgTreat =
    knockOutWhiteBackdrop && !bare
      ? 'mix-blend-multiply brightness-[1.38] contrast-[1.12] saturate-[1.06]'
      : bare
        ? ''
        : 'brightness-[1.28] contrast-[1.12] saturate-[1.07]';

  const alignCls =
    align === 'end'
      ? 'items-end justify-center'
      : align === 'start'
        ? 'items-start justify-center'
        : 'items-center justify-center';

  return (
    <div className={`relative flex overflow-visible rounded-2xl ${alignCls} ${wrap} ${className}`}>
      <img
        src={assetUrl(src)}
        alt={alt}
        className={`pointer-events-none h-auto w-auto max-w-full select-none object-contain [image-rendering:auto] ${imgTreat} ${imgClassName}`}
        draggable={false}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

function StoryCard({ src, alt, text }: { src: string; alt: string; text: string }) {
  const characterStage =
    'relative z-[1] flex h-[clamp(12.75rem,44vw,16.75rem)] w-full overflow-visible sm:h-[clamp(13.25rem,40vw,17.75rem)] lg:h-[clamp(13.5rem,34vw,18.25rem)] xl:h-[clamp(13.75rem,30vw,18.75rem)]';

  return (
    <div
      className={`relative z-[1] flex h-full min-h-0 min-w-0 flex-col rounded-2xl p-3 pb-3 sm:p-4 sm:pb-3.5 ${historiaPanel}`}
    >
      <div className="relative z-[1] flex min-w-0 flex-col">
        <div className={characterStage}>
          <HistoriaCharacterGlow />
          <CutoutCharacter
            src={src}
            alt={alt}
            bare
            align="end"
            className="absolute inset-0 z-[1] flex items-end justify-center rounded-none bg-transparent py-0"
            imgClassName="max-h-[148%] max-w-[min(138%,27rem)] object-contain object-bottom sm:max-h-[152%] sm:max-w-[min(142%,29rem)] lg:max-h-[162%] lg:max-w-[min(148%,32rem)] xl:max-h-[174%] xl:max-w-[min(155%,34rem)]"
          />
        </div>
        <p className="relative z-[1] mt-2 shrink-0 font-space text-[11px] leading-snug text-white/90 sm:mt-2.5 sm:text-xs sm:leading-snug md:text-[0.8125rem] md:leading-snug">
          {text}
        </p>
      </div>
    </div>
  );
}


export default function HistoriaScreen() {
  return (
    <div className="screen-shell flex min-h-0 flex-1 flex-col overflow-visible">
      <motion.div className="shrink-0 text-center" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-orbitron text-lg tracking-[0.28em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.08)] sm:text-xl md:text-2xl">
          HISTORIA
        </h2>
        <div className="mx-auto mt-1.5 h-px w-24 bg-gradient-to-r from-transparent via-amber-200/70 to-transparent sm:w-32" />
      </motion.div>

      <div className="relative mt-8 flex min-h-0 flex-1 flex-col sm:mt-10 lg:mt-14">
        <motion.div
          className="mx-auto grid min-h-0 w-full max-w-[1360px] flex-1 grid-cols-1 items-start gap-3 px-2 sm:gap-4 sm:px-4 lg:items-stretch lg:gap-4 lg:px-6 lg:[grid-template-columns:minmax(0,1.42fr)_minmax(0,0.86fr)_minmax(0,0.86fr)_minmax(0,0.86fr)] xl:gap-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Caja 1: móvil = alien arriba + línea del tiempo abajo; lg = fila más ancha + alien escalado al estilo StoryCard */}
          <div
            className={`relative z-[1] flex h-full min-h-0 w-full min-w-0 flex-col gap-3 overflow-visible rounded-2xl p-3 sm:gap-4 sm:p-4 lg:gap-3 ${historiaPanel}`}
          >
            <div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-visible lg:flex-row lg:items-stretch lg:gap-3">
              <div className="relative z-[8] flex h-[min(42vh,21.5rem)] w-full shrink-0 items-end justify-center overflow-visible px-0 pt-0 sm:h-[min(44vh,23rem)] lg:h-[clamp(13.5rem,28vw,18.25rem)] lg:min-h-0 lg:w-[46%] lg:max-w-none lg:shrink-0 lg:flex-none lg:self-stretch lg:py-1 xl:h-[clamp(13.75rem,24vw,18.75rem)]">
                <HistoriaCharacterGlow className="left-1/2 top-1/2 z-[7] w-[min(95%,18rem)] blur-[42px] sm:w-[min(98%,19rem)] lg:w-[min(112%,24rem)] xl:w-[min(118%,26rem)]" />
                <img
                  src={assetUrl('/assets/historia-linea-tiempo.png')}
                  alt="E.T. con playera Reparilandia"
                  className="relative z-[9] pointer-events-none h-auto w-full max-w-full select-none object-contain object-bottom mix-blend-screen brightness-[1.14] contrast-[1.08] saturate-[1.05] [image-rendering:auto] max-h-[min(100%,18rem)] sm:max-h-[min(100%,19rem)] lg:max-h-[162%] lg:max-w-[min(148%,32rem)] xl:max-h-[174%] xl:max-w-[min(155%,34rem)]"
                  draggable={false}
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="relative z-[15] flex min-h-0 min-w-0 flex-1 flex-col lg:basis-0 lg:overflow-hidden">
                <h3 className="mb-2 flex min-w-0 shrink-0 items-center gap-2 font-orbitron text-[10px] tracking-[0.2em] text-amber-100/95 sm:text-xs">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.65)]" aria-hidden />
                  <span className="min-w-0 break-words">LÍNEA DEL TIEMPO</span>
                </h3>
                <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-2.5 overflow-y-auto overflow-x-hidden overscroll-contain py-0.5 pl-1 pr-0.5 sm:gap-3 scrollbar-hide">
                  <div
                    className="absolute bottom-1 left-[0.45rem] top-7 w-0 border-l border-dashed border-cyan-400/45"
                    aria-hidden
                  />
                  {milestones.map((m, i) => (
                    <div key={i} className="relative flex min-w-0 items-start gap-2 pl-6 sm:gap-3">
                      <span
                        className="absolute left-0 top-1.5 z-[1] h-2 w-2 shrink-0 rounded-full border border-cyan-300/70 bg-[#0b1a1f] shadow-[0_0_10px_rgba(34,211,238,0.35)]"
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-orbitron text-[10px] font-semibold tabular-nums tracking-[0.14em] text-cyan-200/95 sm:text-[11px]">
                          {m.year}
                        </p>
                        <p className="mt-0.5 break-words font-space text-[10px] leading-snug text-white/88 sm:text-[11px] sm:leading-snug md:text-xs">
                          {m.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <StoryCard
            src="/assets/historia-panel-2.png"
            alt="Integrante del equipo Reparilandia, pelo largo en ponytail"
            text={storyPanel2}
          />
          <StoryCard
            src="/assets/historia-panel-3.png"
            alt="Integrante del equipo con sombrero y barba"
            text={storyPanel3}
          />
          <StoryCard
            src="/assets/historia-panel-4.png"
            alt="Integrante del equipo con gafas y playera Reparilandia"
            text={storyPanel4}
          />
        </motion.div>
      </div>

      <p className="sr-only">
        Cuatro paneles: línea del tiempo del taller Reparilandia y retratos del equipo con historias breves.
      </p>
    </div>
  );
}
