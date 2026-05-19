'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import CarouselDots from '@/components/CarouselDots';
import MobileScreenLayout from '@/components/MobileScreenLayout';
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

const storySlides = [
  {
    src: '/assets/historia-panel-2.png',
    alt: 'Omar Lugo, integrante del equipo Reparilandia, pelo largo en ponytail',
    text: storyPanel2,
    blendLighten: true,
  },
  {
    src: '/assets/historia-panel-3.png',
    alt: 'Carlos Díaz, integrante del equipo con sombrero y barba',
    text: storyPanel3,
    blendLighten: true,
  },
  {
    src: '/assets/historia-panel-4.png',
    alt: 'Francisco Medina, integrante del equipo con gafas y playera Reparilandia',
    text: storyPanel4,
    blendLighten: true,
  },
] as const;

/** Paneles Historia: borde azul; hover/touch → amarillo (ver .historia-panel en globals.css). */
const historiaPanel = 'historia-panel';

const historiaCharacterSpot =
  'relative z-[1] isolate mx-auto flex w-full max-w-[88%] items-end justify-center overflow-visible leading-[0] pt-1.5 sm:max-w-[90%] sm:pt-2 lg:max-w-[94%] lg:pt-1';

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
  bare?: boolean;
  knockOutWhiteBackdrop?: boolean;
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
    <motion.div className={`relative flex overflow-visible rounded-2xl ${alignCls} ${wrap} ${className}`}>
      <img
        src={assetUrl(src)}
        alt={alt}
        className={`pointer-events-none h-auto w-auto select-none object-contain [image-rendering:auto] ${imgTreat} ${imgClassName || 'max-w-full'}`}
        draggable={false}
        loading="eager"
        decoding="async"
      />
    </motion.div>
  );
}

const storyCardCharacterImg =
  '!max-w-none w-auto object-contain object-bottom max-h-[min(8.75rem,34vw)] sm:max-h-[min(11.25rem,36vw)] lg:max-h-[14.25rem] xl:max-h-[15rem]';

const storyCardCharacterImgCompact =
  '!max-w-none w-auto object-contain object-bottom max-h-[min(6.5rem,26vw)]';

function StoryCard({
  src,
  alt,
  text,
  blendLighten = false,
  compact = false,
}: {
  src: string;
  alt: string;
  text: string;
  blendLighten?: boolean;
  compact?: boolean;
}) {
  const imgClass = `${compact ? storyCardCharacterImgCompact : storyCardCharacterImg}${blendLighten ? ' mix-blend-lighten' : ''}`;

  return (
    <motion.div
      className={`relative z-[1] flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl px-3 pb-3 pt-3 sm:px-3.5 sm:pb-3 sm:pt-4 lg:px-4 lg:pb-4 lg:pt-4 ${historiaPanel}`}
    >
      <motion.div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col gap-2 lg:justify-center lg:gap-1.5">
        <motion.div className={`${historiaCharacterSpot} lg:shrink-0`}>
          <CutoutCharacter
            src={src}
            alt={alt}
            bare
            align="end"
            className="flex w-full items-end justify-center rounded-none bg-transparent py-0"
            imgClassName={imgClass}
          />
        </motion.div>
        <p
          className={`story-card-text relative z-[1] min-h-0 overflow-hidden font-space text-white/92 ${
            compact
              ? 'line-clamp-[10] flex-1 text-[14px] leading-snug'
              : 'text-xs leading-relaxed sm:text-xs sm:leading-snug md:text-[0.8125rem] md:leading-relaxed lg:shrink-0 lg:line-clamp-[10] lg:text-[0.875rem] xl:text-[0.9375rem] xl:leading-snug'
          }`}
        >
          {text}
        </p>
      </motion.div>
    </motion.div>
  );
}

function TimelinePanel({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      className={`relative z-[1] flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl px-3 pb-3 pt-3.5 sm:px-3.5 sm:pb-3.5 sm:pt-4 lg:gap-2.5 lg:px-4 lg:pb-4 lg:pt-4 ${historiaPanel} ${
        compact ? 'gap-2' : 'gap-2.5 sm:gap-3'
      }`}
    >
      <motion.div
        className={`relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden sm:gap-3 lg:flex-row lg:items-stretch lg:justify-center lg:gap-2 ${
          compact ? 'gap-2' : 'gap-2.5'
        }`}
      >
        <motion.div
          className={`relative z-[8] flex w-full shrink-0 items-end justify-center overflow-visible px-0 pt-0 max-lg:overflow-visible lg:h-full lg:min-h-0 lg:w-[48%] lg:max-w-none lg:flex-none lg:items-center lg:justify-center lg:overflow-hidden lg:px-1 ${
            compact
              ? 'h-[min(9vh,4.25rem)]'
              : 'h-[min(20vh,10rem)] sm:h-[min(28vh,13rem)]'
          }`}
        >
          <img
            src={assetUrl('/assets/historia-linea-tiempo.png')}
            alt="E.T. con playera Reparilandia"
            className={`relative z-[1] pointer-events-none h-auto max-h-full max-w-full select-none object-contain object-bottom brightness-[1.14] contrast-[1.08] saturate-[1.05] [image-rendering:auto] origin-bottom max-lg:origin-bottom lg:mx-auto lg:origin-center lg:object-center ${
              compact
                ? 'mb-0 w-[min(100%,9rem)] scale-[1.05]'
                : 'mb-4 w-[min(100%,20.5rem)] translate-y-0 scale-[1.08] sm:mb-9 sm:w-[min(100%,25.5rem)] sm:translate-y-1 sm:scale-[1.12] lg:mb-0 lg:w-full lg:max-h-none lg:max-w-full lg:-translate-y-4 lg:scale-[2.52] xl:-translate-y-5 xl:scale-[2.74]'
            }`}
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </motion.div>

        <motion.div className="relative z-[15] flex min-h-0 min-w-0 flex-1 flex-col justify-center pt-2 sm:pt-2.5 lg:self-start lg:justify-start lg:pt-5 lg:min-w-0 lg:flex-1 lg:overflow-hidden xl:pt-6">
          <h3
            className={`mb-2 flex min-w-0 shrink-0 items-center gap-2 font-orbitron tracking-[0.18em] text-amber-100/95 ${
              compact ? 'text-[12px]' : 'text-xs sm:text-xs md:text-[0.8125rem] lg:mb-1 lg:text-[0.9375rem]'
            }`}
          >
            <span
              className={`inline-block shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.65)] ${compact ? 'h-1.5 w-1.5' : 'h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-2 lg:w-2'}`}
              aria-hidden
            />
            <span className="min-w-0 break-words">LÍNEA DEL TIEMPO</span>
          </h3>
          <motion.div
            className={`relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden py-0.5 pl-1 pr-0.5 ${
              compact ? 'gap-1' : 'gap-2 sm:gap-2.5 lg:gap-2 lg:mt-2'
            }`}
          >
            <motion.div
              className={`absolute bottom-1 left-[0.45rem] w-0 border-l border-dashed border-cyan-400/45 ${compact ? 'top-7' : 'top-9 sm:top-10 lg:top-12 xl:top-[3.25rem]'}`}
              aria-hidden
            />
            {milestones.map((m, i) => (
              <motion.div key={i} className={`relative flex min-w-0 items-start pl-6 ${compact ? 'gap-1.5' : 'gap-2 sm:gap-3 sm:pl-7'}`}>
                <span
                  className={`absolute left-0 z-[1] shrink-0 rounded-full border border-cyan-300/70 bg-[#0b1a1f] shadow-[0_0_10px_rgba(34,211,238,0.35)] ${
                    compact ? 'top-1 h-1.5 w-1.5' : 'top-1.5 h-2 w-2 sm:top-2 sm:h-2.5 sm:w-2.5'
                  }`}
                  aria-hidden
                />
                <motion.div className="min-w-0 flex-1">
                  <p
                    className={`font-orbitron font-semibold tabular-nums tracking-[0.14em] text-cyan-200/95 ${
                      compact ? 'text-[12px]' : 'text-xs sm:text-xs md:text-[0.8125rem] lg:text-[0.9375rem]'
                    }`}
                  >
                    {m.year}
                  </p>
                  <p
                    className={`mt-0.5 break-words font-space text-white/90 ${
                      compact ? 'text-[14px] leading-relaxed' : 'text-xs leading-relaxed sm:text-xs sm:leading-snug md:text-[0.8125rem] lg:text-[0.875rem] xl:text-[0.9375rem] xl:leading-snug'
                    }`}
                  >
                    {m.text}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function HistoriaScreen() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: 'x', duration: 22 });
  const [slideIndex, setSlideIndex] = useState(0);
  const slideCount = 1 + storySlides.length;

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSlideIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <MobileScreenLayout title="HISTORIA" showRule hideLeadOnMobile className="historia-screen">
      {/* Móvil: un slide a la vez, sin scroll vertical de página */}
      <motion.div
        className="flex min-h-0 flex-1 flex-col overflow-hidden lg:hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div ref={emblaRef} className="min-h-0 flex-1 overflow-hidden">
          <motion.div className="flex h-full touch-pan-x">
            <motion.div className="flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full px-0.5">
              <TimelinePanel compact />
            </motion.div>
            {storySlides.map((slide) => (
              <motion.div
                key={slide.src}
                className="flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full px-0.5"
              >
                <StoryCard {...slide} compact />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <CarouselDots
          count={slideCount}
          active={slideIndex}
          onSelect={scrollTo}
          className="shrink-0 pt-1.5 max-lg:pb-0"
        />
      </motion.div>

      {/* Escritorio: 4 paneles centrados entre título y dock */}
      <motion.div className="relative hidden min-h-0 flex-1 overflow-hidden lg:flex lg:items-start lg:justify-center lg:px-2 lg:pb-3 lg:pt-11 xl:pt-[3.25rem]">
        <motion.div
          className="mx-auto grid h-auto w-full max-w-[min(100%,1480px)] min-h-0 max-h-[min(70cqh,66dvh)] grid-cols-1 items-stretch gap-3 overflow-hidden px-1 sm:gap-3.5 sm:px-4 lg:mt-9 lg:gap-3.5 lg:px-5 lg:[grid-template-columns:minmax(0,1.42fr)_minmax(0,0.86fr)_minmax(0,0.86fr)_minmax(0,0.86fr)] xl:mt-11 xl:max-h-[min(72cqh,68dvh)] xl:gap-4 [&>*]:min-h-0 [&>*]:h-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <TimelinePanel />
          {storySlides.map((slide) => (
            <StoryCard key={slide.src} {...slide} />
          ))}
        </motion.div>
      </motion.div>

      <p className="sr-only">
        Cuatro paneles: línea del tiempo del taller Reparilandia; Omar Lugo, Carlos Díaz y Francisco Medina con historias breves.
      </p>
    </MobileScreenLayout>
  );
}
