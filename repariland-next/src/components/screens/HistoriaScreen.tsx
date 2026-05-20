'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSmoothEmblaCarousel } from '@/hooks/useSmoothEmblaCarousel';
import CarouselDots from '@/components/CarouselDots';
import MobileScreenLayout from '@/components/MobileScreenLayout';
import { assetUrl } from '@/lib/assetUrl';
import { useHistoriaMobileZone } from '@/hooks/useHistoriaMobileZone';
import { useHistoriaMobileFit } from '@/hooks/useHistoriaMobileFit';

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
  '!max-w-none w-auto max-h-full max-w-[min(96%,14rem)] object-contain object-bottom sm:max-w-[min(96%,15rem)]';

const storyCardCharacterImgMobileStack =
  '!max-w-none h-full w-auto max-h-full max-w-[min(98%,18rem)] object-contain object-bottom';

const storyCardCharacterImgMobileGrid =
  '!max-w-none w-auto object-contain object-bottom max-h-[min(2.75rem,11vw)]';

const historiaMobilePanelArrowClass =
  'historia-mobile-panel-arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/95 shadow-[0_0_14px_rgba(0,0,0,0.45)] backdrop-blur-sm touch-manipulation transition-[opacity,background-color] disabled:pointer-events-none disabled:opacity-35 enabled:hover:bg-black/72 enabled:active:scale-95';

function HistoriaMobilePanelNav({
  index,
  total,
  onPrev,
  onNext,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const canPrev = index > 0;
  const canNext = index < total - 1;

  return (
    <nav
      className="historia-story-mobile-nav flex shrink-0 items-center justify-center gap-2.5 pt-1 max-lg:min-h-[2.35rem] max-lg:pb-0.5 lg:hidden"
      aria-label="Cambiar panel de historia"
    >
      <button
        type="button"
        className={historiaMobilePanelArrowClass}
        aria-label="Panel anterior"
        disabled={!canPrev}
        onClick={onPrev}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
      </button>
      <span className="min-w-[2.75rem] text-center font-orbitron text-[9px] tabular-nums tracking-[0.12em] text-white/45">
        {index + 1}/{total}
      </span>
      <button
        type="button"
        className={historiaMobilePanelArrowClass}
        aria-label="Panel siguiente"
        disabled={!canNext}
        onClick={onNext}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </nav>
  );
}

function StoryCard({
  src,
  alt,
  text,
  blendLighten = false,
  compact = false,
  mobileGrid = false,
  mobileStack = false,
  mobileNav,
}: {
  src: string;
  alt: string;
  text: string;
  blendLighten?: boolean;
  compact?: boolean;
  mobileGrid?: boolean;
  /** Móvil: caricatura arriba, texto abajo */
  mobileStack?: boolean;
  /** Móvil: flechas bajo el texto para cambiar de panel */
  mobileNav?: { index: number; total: number; onPrev: () => void; onNext: () => void };
}) {
  const imgClass = mobileGrid
    ? `${storyCardCharacterImgMobileGrid}${blendLighten ? ' mix-blend-lighten' : ''}`
    : mobileStack
      ? `${storyCardCharacterImgMobileStack}${blendLighten ? ' mix-blend-lighten' : ''}`
      : `${compact ? storyCardCharacterImgCompact : storyCardCharacterImg}${blendLighten ? ' mix-blend-lighten' : ''}`;

  return (
    <motion.div
      className={`relative z-[1] flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl ${historiaPanel} ${
        mobileGrid
          ? 'rounded-xl px-1.5 pb-1.5 pt-1.5'
          : 'px-3 pb-3 pt-3 sm:px-3.5 sm:pb-3 sm:pt-4 lg:px-4 lg:pb-4 lg:pt-4'
      } ${mobileStack ? 'historia-story-panel--mobile-stack' : ''}`}
    >
      <motion.div
        className={`historia-story-layout relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col lg:justify-center ${
          mobileGrid ? 'gap-0.5' : compact || mobileStack ? 'min-h-0 flex-1 gap-2' : 'gap-2 lg:gap-1.5'
        }`}
      >
        <motion.div
          className={`historia-story-char ${
            compact || mobileStack
              ? 'relative z-[1] flex min-h-0 w-full max-w-full flex-[0_1_auto] items-end justify-center overflow-visible pt-0'
              : `${historiaCharacterSpot} lg:shrink-0`
          } ${mobileGrid ? 'max-w-full pt-0' : ''}`}
        >
          <CutoutCharacter
            src={src}
            alt={alt}
            bare
            align="end"
            className={`flex w-full items-end justify-center rounded-none bg-transparent py-0 ${compact ? 'h-full' : ''}`}
            imgClassName={imgClass}
          />
        </motion.div>
        <p
          className={`story-card-text relative z-[1] min-h-0 font-space text-white/92 ${
            mobileGrid
              ? 'line-clamp-[6] flex-1 overflow-hidden text-[9px] leading-[1.25] tracking-[0.01em] sm:text-[10px]'
              : compact || mobileStack
                ? 'historia-story-fit-text flex flex-1 flex-col justify-start overflow-hidden text-[11px] leading-snug tracking-[0.01em] sm:text-xs sm:leading-snug max-lg:overflow-y-hidden'
                : 'overflow-hidden text-xs leading-relaxed sm:text-xs sm:leading-snug md:text-[0.8125rem] md:leading-relaxed lg:shrink-0 lg:line-clamp-[10] lg:text-[0.875rem] xl:text-[0.9375rem] xl:leading-snug'
          }`}
        >
          {text}
        </p>
      </motion.div>
      {mobileStack && mobileNav ? (
        <HistoriaMobilePanelNav
          index={mobileNav.index}
          total={mobileNav.total}
          onPrev={mobileNav.onPrev}
          onNext={mobileNav.onNext}
        />
      ) : null}
    </motion.div>
  );
}

function TimelinePanel({
  compact = false,
  mobileGrid = false,
  mobileRow = false,
}: {
  compact?: boolean;
  mobileGrid?: boolean;
  /** Móvil: alien izquierda, línea del tiempo derecha */
  mobileRow?: boolean;
}) {
  return (
    <motion.div
      className={`relative z-[1] flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden ${historiaPanel} ${
        mobileGrid
          ? 'gap-1 rounded-xl px-1.5 pb-1.5 pt-1.5'
          : `rounded-2xl px-3 pb-3 pt-3.5 sm:px-3.5 sm:pb-3.5 sm:pt-4 lg:gap-2.5 lg:px-4 lg:pb-4 lg:pt-4 ${compact ? 'gap-0 px-2.5 pb-2.5 pt-2.5 sm:px-3' : 'gap-2.5 sm:gap-3'}`
      } ${mobileRow ? 'historia-timeline-panel--mobile-row' : ''}`}
    >
      <motion.div
        className={`relative z-[1] flex min-h-0 min-w-0 flex-1 overflow-hidden ${
          compact || mobileRow
            ? 'historia-timeline-layout--row flex-row items-stretch gap-2 sm:gap-2'
            : `flex-col lg:flex-row lg:items-stretch lg:justify-center lg:gap-2 ${mobileGrid ? 'gap-1' : 'gap-2.5 sm:gap-3'}`
        }`}
      >
        {!mobileGrid ? (
        <motion.div
          className={`historia-et-col relative z-[8] flex shrink-0 items-end justify-center overflow-visible px-0 pt-0 max-lg:overflow-visible lg:h-full lg:min-h-0 lg:flex-none lg:items-center lg:justify-center lg:overflow-hidden lg:px-1 ${
            mobileRow
              ? 'min-w-0 max-w-none self-stretch max-lg:items-center max-lg:justify-end'
              : compact
                ? 'w-[40%] min-w-[5.5rem] max-w-[9.5rem] self-stretch max-lg:items-center max-lg:justify-end'
                : 'w-full lg:w-[48%] lg:max-w-none h-[min(20vh,10rem)] sm:h-[min(28vh,13rem)]'
          }`}
        >
          <img
            src={assetUrl('/assets/historia-linea-tiempo.png')}
            alt="E.T. con playera Reparilandia"
            className={`historia-et-img relative z-[12] pointer-events-none block select-none brightness-[1.14] contrast-[1.08] saturate-[1.05] [image-rendering:auto] ${
              mobileRow
                ? 'h-auto w-auto max-h-none max-w-none min-h-0 object-contain'
                : compact
                  ? 'h-full max-h-full min-h-0 w-full max-w-full object-contain object-bottom origin-bottom'
                  : 'mb-4 h-auto min-h-[4.25rem] w-full min-w-[3.75rem] max-h-full max-w-full object-contain object-bottom origin-bottom max-lg:origin-bottom lg:mx-auto lg:min-h-0 lg:min-w-0 lg:origin-center lg:object-center lg:mb-0 lg:max-h-none lg:-translate-y-4 lg:scale-[2.52] xl:-translate-y-5 xl:scale-[2.74]'
            }`}
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </motion.div>
        ) : null}

        <motion.div
          className={`historia-timeline-copy relative z-[15] flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:self-start lg:justify-start lg:min-w-0 lg:flex-1 lg:overflow-hidden ${
            mobileGrid || compact || mobileRow
              ? 'justify-start pt-0'
              : 'justify-center pt-2 sm:pt-2.5 lg:pt-5 xl:pt-6'
          }`}
        >
          <h3
            className={`flex min-w-0 shrink-0 items-center gap-1.5 font-orbitron tracking-[0.14em] text-amber-100/95 ${
              mobileGrid
                ? 'mb-0.5 text-[9px] sm:text-[10px]'
                : mobileRow
                  ? 'mb-0.5 text-[11px] tracking-[0.1em] sm:text-[12px] lg:text-xs'
                  : compact
                    ? 'mb-0.5 text-[10px] tracking-[0.1em] sm:text-[11px]'
                    : 'mb-2 text-xs sm:text-xs md:text-[0.8125rem] lg:mb-1 lg:text-[0.9375rem]'
            }`}
          >
            <span
              className={`inline-block shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.65)] ${
                mobileGrid ? 'h-1 w-1' : compact ? 'h-1.5 w-1.5' : 'h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-2 lg:w-2'
              }`}
              aria-hidden
            />
            <span className="min-w-0 break-words leading-none">LÍNEA DEL TIEMPO</span>
          </h3>
          <motion.div
            className={`relative flex min-h-0 min-w-0 flex-col overflow-hidden py-0.5 pl-1 pr-0.5 ${
              mobileRow
                ? 'historia-timeline-milestones historia-timeline-fit-copy max-lg:flex-1 max-lg:min-h-0 max-lg:justify-start max-lg:gap-1.5'
                : mobileGrid
                  ? 'flex-1 gap-0'
                  : compact
                    ? 'flex-1 gap-0.5'
                    : 'flex-1 gap-2 sm:gap-2.5 lg:gap-2 lg:mt-2'
            }`}
          >
            <motion.div
              className={`historia-timeline-axis absolute left-[0.35rem] w-0 border-l border-dashed border-cyan-400/45 ${
                mobileRow
                  ? 'historia-timeline-axis--mobile top-[1.05rem] bottom-auto h-[calc(100%-0.2rem)]'
                  : mobileGrid
                    ? 'bottom-0.5 top-4'
                    : compact
                      ? 'bottom-0.5 top-5 sm:top-6'
                      : 'bottom-0.5 top-9 sm:top-10 lg:top-12 xl:top-[3.25rem]'
              }`}
              aria-hidden
            />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className={`relative flex min-w-0 items-start ${
                  mobileGrid
                    ? 'gap-1 pl-4'
                    : compact || mobileRow
                      ? 'gap-0.5 pl-3.5'
                      : 'gap-2 pl-6 sm:gap-3 sm:pl-7'
                }`}
              >
                <span
                  className={`absolute left-0 z-[1] shrink-0 rounded-full border border-cyan-300/70 bg-[#0b1a1f] shadow-[0_0_10px_rgba(34,211,238,0.35)] ${
                    mobileGrid
                      ? 'top-0.5 h-1 w-1'
                      : compact
                        ? 'top-0.5 h-1 w-1 sm:h-1.5 sm:w-1.5'
                        : 'top-1.5 h-2 w-2 sm:top-2 sm:h-2.5 sm:w-2.5'
                  }`}
                  aria-hidden
                />
                <motion.div className="min-w-0 flex-1">
                  <p
                    className={`font-orbitron font-semibold tabular-nums leading-none tracking-[0.1em] text-cyan-200/95 ${
                      mobileGrid
                        ? 'text-[9px] sm:text-[10px]'
                        : mobileRow
                          ? 'text-[11px] sm:text-[12px] lg:text-xs'
                          : compact
                            ? 'text-[10px] sm:text-[11px]'
                            : 'text-xs sm:text-xs md:text-[0.8125rem] lg:text-[0.9375rem]'
                    }`}
                  >
                    {m.year}
                  </p>
                  <p
                    className={`break-words font-space text-white/90 ${
                      mobileGrid
                        ? 'mt-0 text-[8px] leading-[1.2] sm:text-[9px]'
                        : mobileRow
                          ? 'mt-0 text-[10px] leading-[1.28] sm:text-[11px] sm:leading-[1.32] lg:text-xs'
                          : compact
                            ? 'mt-0 text-[9px] leading-[1.2] sm:text-[10px] sm:leading-[1.22]'
                            : 'mt-0.5 text-xs leading-relaxed sm:text-xs sm:leading-snug md:text-[0.8125rem] lg:text-[0.875rem] xl:text-[0.9375rem] xl:leading-snug'
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

export default function HistoriaScreen({ isScreenActive = true }: { isScreenActive?: boolean }) {
  const [emblaRef, emblaApi, scrollTo] = useSmoothEmblaCarousel({ loop: false, axis: 'x' });
  const [slideIndex, setSlideIndex] = useState(0);
  const slideCount = 1 + storySlides.length;

  useHistoriaMobileZone(isScreenActive);
  useHistoriaMobileFit(slideIndex, isScreenActive);

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

  return (
    <MobileScreenLayout title="HISTORIA" showRule hideLeadOnMobile className="historia-screen" data-screen="historia">
      {/* Móvil: un panel por slide (deslizar), como Inicio */}
      <motion.div
        className="historia-mobile-slides flex min-h-0 flex-1 flex-col overflow-hidden lg:hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="historia-mobile-carousel">
          <motion.div ref={emblaRef} className="embla-fluid historia-mobile-embla min-h-0 flex-1 overflow-hidden">
            <div className="flex h-full touch-pan-x">
              <div className="historia-timeline-slide flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full px-1">
                <TimelinePanel compact mobileRow />
              </div>
              {storySlides.map((slide, storyIdx) => {
                const panelIndex = storyIdx + 1;
                return (
                  <motion.div
                    key={slide.src}
                    className="historia-story-slide flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full px-1"
                  >
                    <StoryCard
                      {...slide}
                      compact
                      mobileStack
                      mobileNav={{
                        index: panelIndex,
                        total: slideCount,
                        onPrev: () => scrollTo(panelIndex - 1),
                        onNext: () => scrollTo(panelIndex + 1),
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          <CarouselDots
            count={slideCount}
            active={slideIndex}
            onSelect={scrollTo}
            className="historia-mobile-dots shrink-0 pt-1 max-lg:pb-1"
          />
        </motion.div>
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
