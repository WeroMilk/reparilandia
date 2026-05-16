import { motion } from 'framer-motion';
import ScreenPageTitle from '@/components/ScreenPageTitle';
import { assetUrl } from '@/lib/assetUrl';

const milestones = [
  { year: '1985', text: 'Don Jaime abre el taller con una caja de herramientas y un sueño.' },
  { year: '2000', text: 'Carlos se une al negocio familiar, trayendo visión creativa.' },
  { year: '2010', text: 'El taller evoluciona: coleccionismo y museo.' },
  { year: '2026', text: 'Dos generaciones, una pasión por reparar el pasado.' },
];

const storyPanel2 =
  'Omar Lugo es el genio técnico del equipo: experto en electrónica, cómputo y mecatrónica, forjado en la experiencia. Ha devuelto la vida a cámaras digitales, tarjetas madre e impresoras 3D; donde otros ven piezas irrecuperables, él ve un reto que merece resolverse.';

const storyPanel3 =
  'Carlos Díaz, jefe y visionario, encarna la perseverancia de quien no descansa hasta dar con la solución. No se conforma mientras quede una posibilidad por explorar; su saber creció con los años, tejido de la práctica con artículos electrónicos y la tecnología que hoy llega al banco de trabajo.';

const storyPanel4 =
  'Francisco Medina, administrador del taller, teje el día a día: proveedores, clientes, facturación, cotizaciones y la búsqueda incansable de refacciones. No cesa hasta hallar al proveedor ideal que convierta cada diagnóstico en una solución concreta.';

/** Paneles Historia: borde azul; hover/touch → amarillo (ver .historia-panel en globals.css). */
const historiaPanel = 'historia-panel';

const historiaCharacterSpot =
  'relative z-[1] flex w-full items-end justify-center overflow-visible leading-[0]';

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
        className={`pointer-events-none h-auto w-auto select-none object-contain [image-rendering:auto] ${imgTreat} ${imgClassName || 'max-w-full'}`}
        draggable={false}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

const storyCardCharacterImg =
  '!max-w-none w-auto object-contain object-bottom max-h-[min(10.5rem,40vw)] sm:max-h-[min(11.25rem,36vw)] lg:max-h-[12.25rem] xl:max-h-[12.75rem]';

function StoryCard({ src, alt, text }: { src: string; alt: string; text: string }) {
  return (
    <div
      className={`relative z-[1] flex h-full min-h-0 min-w-0 flex-col rounded-2xl p-3 pb-2.5 sm:p-3.5 sm:pb-3 ${historiaPanel}`}
    >
      <div className="relative z-[1] flex min-h-0 min-w-0 flex-col gap-1.5">
        <div className={historiaCharacterSpot}>
          <CutoutCharacter
            src={src}
            alt={alt}
            bare
            align="end"
            className="flex w-full items-end justify-center rounded-none bg-transparent py-0"
            imgClassName={storyCardCharacterImg}
          />
        </div>
        <p className="relative z-[1] shrink-0 pt-0 font-space text-[11px] leading-snug text-white/90 sm:text-xs sm:leading-snug md:text-[0.8125rem] md:leading-snug">
          {text}
        </p>
      </div>
    </div>
  );
}


export default function HistoriaScreen() {
  return (
    <div className="screen-shell flex min-h-0 flex-1 flex-col overflow-visible">
      <ScreenPageTitle showRule>HISTORIA</ScreenPageTitle>

      <motion.div className="relative mt-[clamp(3rem,7dvh,4.25rem)] flex min-h-0 flex-1 flex-col sm:mt-[clamp(3.5rem,8dvh,5rem)] lg:mt-[clamp(4.25rem,9.5dvh,6.25rem)]">
        <motion.div
          className="mx-auto grid w-full max-w-[1360px] grid-cols-1 items-stretch gap-3 px-2 sm:gap-3.5 sm:px-4 lg:gap-3.5 lg:px-6 lg:[grid-template-columns:minmax(0,1.42fr)_minmax(0,0.86fr)_minmax(0,0.86fr)_minmax(0,0.86fr)] xl:gap-4 [&>*]:min-h-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Caja 1: móvil = alien arriba + línea del tiempo abajo; lg = fila más ancha + alien escalado al estilo StoryCard */}
          <div
            className={`relative z-[1] flex h-full min-h-0 w-full min-w-0 flex-col gap-2.5 overflow-hidden rounded-2xl p-3 sm:gap-3 sm:p-3.5 lg:gap-2.5 ${historiaPanel}`}
          >
            <motion.div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col gap-2.5 overflow-visible sm:gap-3 lg:flex-row lg:items-stretch lg:gap-3">
              <motion.div className="relative z-[8] flex h-[min(36vh,19rem)] w-full shrink-0 items-end justify-center overflow-visible px-0 pt-0 sm:h-[min(38vh,20rem)] lg:h-full lg:min-h-[clamp(10.75rem,26vw,14.75rem)] lg:w-[46%] lg:max-w-none lg:flex-none lg:self-stretch xl:min-h-[clamp(11rem,22vw,15.25rem)]">
                <img
                  src={assetUrl('/assets/historia-linea-tiempo.png')}
                  alt="E.T. con playera Reparilandia"
                  className="relative z-[1] mb-8 pointer-events-none h-auto w-[min(138%,22rem)] max-w-none origin-bottom translate-y-0 scale-[1.28] select-none object-contain object-bottom brightness-[1.14] contrast-[1.08] saturate-[1.05] [image-rendering:auto] sm:mb-9 sm:w-[min(144%,23rem)] sm:translate-y-1 sm:scale-[1.34] lg:mb-10 lg:w-[min(178%,32rem)] lg:translate-y-2 lg:scale-[1.46] xl:mb-12 xl:w-[min(188%,34rem)] xl:translate-y-3 xl:scale-[1.52]"
                  draggable={false}
                  loading="eager"
                  decoding="async"
                />
              </motion.div>

              <div className="relative z-[15] flex min-h-0 min-w-0 flex-col lg:min-w-0 lg:flex-1 lg:overflow-hidden">
                <h3 className="mb-2 flex min-w-0 shrink-0 items-center gap-2 font-orbitron text-[11px] tracking-[0.2em] text-amber-100/95 sm:text-xs md:text-[0.8125rem]">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.65)] sm:h-2 sm:w-2" aria-hidden />
                  <span className="min-w-0 break-words">LÍNEA DEL TIEMPO</span>
                </h3>
                <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-2.5 overflow-y-auto overflow-x-hidden overscroll-contain py-0.5 pl-1 pr-0.5 sm:gap-3 lg:gap-3.5 scrollbar-hide">
                  <div
                    className="absolute bottom-1 left-[0.45rem] top-8 w-0 border-l border-dashed border-cyan-400/45 sm:top-9"
                    aria-hidden
                  />
                  {milestones.map((m, i) => (
                    <div key={i} className="relative flex min-w-0 items-start gap-2 pl-6 sm:gap-3 sm:pl-7">
                      <span
                        className="absolute left-0 top-1.5 z-[1] h-2 w-2 shrink-0 rounded-full border border-cyan-300/70 bg-[#0b1a1f] shadow-[0_0_10px_rgba(34,211,238,0.35)] sm:top-2 sm:h-2.5 sm:w-2.5"
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-orbitron text-[11px] font-semibold tabular-nums tracking-[0.14em] text-cyan-200/95 sm:text-xs md:text-[0.8125rem]">
                          {m.year}
                        </p>
                        <p className="mt-0.5 break-words font-space text-[11px] leading-snug text-white/88 sm:text-xs sm:leading-snug md:text-[0.8125rem]">
                          {m.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <StoryCard
            src="/assets/historia-panel-2.png"
            alt="Omar Lugo, integrante del equipo Reparilandia, pelo largo en ponytail"
            text={storyPanel2}
          />
          <StoryCard
            src="/assets/historia-panel-3.png"
            alt="Carlos Díaz, integrante del equipo con sombrero y barba"
            text={storyPanel3}
          />
          <StoryCard
            src="/assets/historia-panel-4.png"
            alt="Francisco Medina, integrante del equipo con gafas y playera Reparilandia"
            text={storyPanel4}
          />
        </motion.div>
      </motion.div>

      <p className="sr-only">
        Cuatro paneles: línea del tiempo del taller Reparilandia; Omar Lugo, Carlos Díaz y Francisco Medina con historias breves.
      </p>
    </div>
  );
}
