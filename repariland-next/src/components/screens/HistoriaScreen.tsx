'use client';

import { motion } from 'framer-motion';
import MobileScreenLayout from '@/components/MobileScreenLayout';
import HistoriaMobileView from '@/components/screens/historia/HistoriaMobileView';
import HistoriaWorkerStats from '@/components/screens/historia/HistoriaWorkerStats';
import { assetUrl } from '@/lib/assetUrl';
import { historiaMilestones, historiaWorkers, type HistoriaWorker } from '@/lib/historiaTeam';

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
  '!max-w-none w-auto object-contain object-bottom max-h-[min(8.75rem,34vw)] sm:max-h-[min(11.25rem,36vw)] lg:max-h-[8.75rem] xl:max-h-[9.5rem]';

function StoryCard({ worker }: { worker: HistoriaWorker }) {
  const imgClass = `${storyCardCharacterImg} mix-blend-lighten`;

  return (
    <motion.div
      className={`relative z-[1] flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl ${historiaPanel} px-3 pb-3 pt-3 sm:px-3.5 sm:pb-3 sm:pt-4 lg:px-4 lg:pb-4 lg:pt-4`}
    >
      <motion.div className="historia-story-layout relative z-[1] flex min-h-0 min-w-0 flex-col items-center gap-2 text-center lg:flex-1">
        <motion.div className={`historia-story-char ${historiaCharacterSpot} lg:shrink-0`}>
          <CutoutCharacter
            src={worker.src}
            alt={worker.alt}
            bare
            align="end"
            className="flex w-full items-end justify-center rounded-none bg-transparent py-0"
            imgClassName={imgClass}
          />
        </motion.div>
        <h3 className="historia-stats__name relative z-[1] shrink-0 text-center font-orbitron text-[0.8125rem] tracking-[0.08em] text-white/96 lg:text-[0.875rem] xl:text-[0.9375rem]">
          {worker.name}
        </h3>
        <HistoriaWorkerStats worker={worker} variant="desktop" />
        <p className="story-card-text relative z-[1] shrink-0 text-balance text-center font-space text-[0.6875rem] leading-snug text-white/82 sm:text-xs lg:text-[0.75rem] xl:text-[0.8125rem] xl:leading-snug">
          {worker.tagline}
        </p>
      </motion.div>
    </motion.div>
  );
}

function TimelinePanel() {
  return (
    <motion.div
      className={`relative z-[1] flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl ${historiaPanel} gap-2.5 px-3 pb-3 pt-3.5 sm:gap-3 sm:px-3.5 sm:pb-3.5 sm:pt-4 lg:gap-2.5 lg:px-4 lg:pb-4 lg:pt-4`}
    >
      <motion.div className="historia-timeline-layout relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col gap-2.5 overflow-hidden sm:gap-3 lg:flex-row lg:items-stretch lg:justify-center lg:gap-2">
        <motion.div
          className={`historia-et-col relative z-[8] flex shrink-0 items-end justify-center overflow-visible px-0 pt-0 max-lg:overflow-visible lg:h-full lg:min-h-0 lg:flex-none lg:items-center lg:justify-center lg:overflow-hidden lg:px-1 w-full h-[min(20vh,10rem)] sm:h-[min(28vh,13rem)] lg:w-[48%] lg:max-w-none`}
        >
          <img
            src={assetUrl('/assets/historia-linea-tiempo.png')}
            alt="E.T. con playera Reparilandia"
            className="historia-et-img relative z-[12] pointer-events-none mb-4 block h-auto min-h-[4.25rem] w-full min-w-[3.75rem] max-h-full max-w-full select-none object-contain object-bottom brightness-[1.14] contrast-[1.08] saturate-[1.05] [image-rendering:auto] origin-bottom max-lg:origin-bottom lg:mx-auto lg:mb-0 lg:min-h-0 lg:min-w-0 lg:max-h-none lg:origin-center lg:object-center lg:-translate-y-4 lg:scale-[2.52] xl:-translate-y-5 xl:scale-[2.74]"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </motion.div>

        <motion.div className="historia-timeline-copy relative z-[15] flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden pt-2 text-center sm:pt-2.5 lg:self-center lg:justify-center lg:pt-0">
          <h3 className="mb-2 flex min-w-0 shrink-0 items-center justify-center gap-1.5 font-orbitron text-xs tracking-[0.14em] text-amber-100/95 sm:text-xs md:text-[0.8125rem] lg:mb-1 lg:text-[0.9375rem]">
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.65)] sm:h-2 sm:w-2 lg:h-2 lg:w-2"
              aria-hidden
            />
            <span className="min-w-0 break-words leading-none">LÍNEA DEL TIEMPO</span>
          </h3>
          <motion.div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden py-0.5 sm:gap-2.5 lg:mt-2 lg:gap-2">
            <motion.div
              className="historia-timeline-axis absolute bottom-0.5 left-1/2 top-8 w-0 -translate-x-1/2 border-l border-dashed border-cyan-400/45 sm:top-9 lg:top-10"
              aria-hidden
            />
            {historiaMilestones.map((m, i) => (
              <motion.div key={i} className="relative z-[1] flex w-full min-w-0 flex-col items-center gap-1 px-1">
                <span
                  className="z-[1] h-2 w-2 shrink-0 rounded-full border border-cyan-300/70 bg-[#0b1a1f] shadow-[0_0_10px_rgba(34,211,238,0.35)] sm:h-2.5 sm:w-2.5"
                  aria-hidden
                />
                <motion.div className="min-w-0 w-full">
                  <p className="font-orbitron text-xs font-semibold tabular-nums leading-none tracking-[0.1em] text-cyan-200/95 sm:text-xs md:text-[0.8125rem] lg:text-[0.9375rem]">
                    {m.year}
                  </p>
                  <p className="mt-0.5 break-words font-space text-xs leading-relaxed text-white/90 sm:text-xs sm:leading-snug md:text-[0.8125rem] lg:text-[0.875rem] xl:text-[0.9375rem] xl:leading-snug">
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
  return (
    <MobileScreenLayout title="HISTORIA" showRule hideLeadOnMobile className="historia-screen" data-screen="historia">
      <HistoriaMobileView isScreenActive={isScreenActive} />

      <motion.div className="relative hidden min-h-0 flex-1 overflow-hidden lg:flex lg:items-start lg:justify-center lg:px-2 lg:pb-3 lg:pt-11 xl:pt-[3.25rem]">
        <motion.div
          className="mx-auto grid h-auto w-full max-w-[min(100%,1480px)] min-h-0 max-h-[min(70cqh,66dvh)] grid-cols-1 items-stretch gap-3 overflow-hidden px-1 sm:gap-3.5 sm:px-4 lg:mt-9 lg:gap-3.5 lg:px-5 lg:[grid-template-columns:minmax(0,1.42fr)_minmax(0,0.86fr)_minmax(0,0.86fr)_minmax(0,0.86fr)] xl:mt-11 xl:max-h-[min(72cqh,68dvh)] xl:gap-4 [&>*]:min-h-0 [&>*]:h-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <TimelinePanel />
          {historiaWorkers.map((worker) => (
            <StoryCard key={worker.src} worker={worker} />
          ))}
        </motion.div>
      </motion.div>

      <p className="sr-only">
        Cuatro paneles: línea del tiempo del taller Reparilandia; fichas de estadísticas de Omar Lugo, Carlos Díaz y Francisco Medina.
      </p>
    </MobileScreenLayout>
  );
}
