'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CarouselDots from '@/components/CarouselDots';
import HistoriaWorkerStats from '@/components/screens/historia/HistoriaWorkerStats';
import { useHistoriaMobileFit } from '@/hooks/useHistoriaMobileFit';
import { useHistoriaMobileZone } from '@/hooks/useHistoriaMobileZone';
import { useSmoothEmblaCarousel } from '@/hooks/useSmoothEmblaCarousel';
import { assetUrl } from '@/lib/assetUrl';
import { historiaMilestones, historiaWorkers, type HistoriaWorker } from '@/lib/historiaTeam';

const SLIDE_COUNT = 1 + historiaWorkers.length;

function TimelinePanel() {
  return (
    <article className="hm-panel hm-panel--timeline historia-panel">
      <h2 className="hm-timeline__title">
        <span className="hm-timeline__title-dot" aria-hidden />
        Línea del tiempo
      </h2>
      <div className="hm-panel__main hm-timeline">
        <div className="hm-timeline__et historia-et-col" aria-hidden>
          <img
            src={assetUrl('/assets/historia-linea-tiempo.webp')}
            alt=""
            className="hm-timeline__et-img historia-et-img"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="hm-timeline__copy">
          <ol className="historia-timeline-fit-copy hm-timeline__list">
            {historiaMilestones.map((m, index) => (
              <li key={m.year} className="hm-timeline__item">
                <div className="hm-timeline__marker">
                  <span className="hm-timeline__year">{m.year}</span>
                  {index < historiaMilestones.length - 1 ? (
                    <span className="hm-timeline__connector" aria-hidden />
                  ) : null}
                </div>
                <p className="hm-timeline__text">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}

function StoryPanel({ worker }: { worker: HistoriaWorker }) {
  return (
    <article className="hm-panel hm-panel--story historia-panel">
      <div className="hm-panel__main hm-story">
        <div className="hm-story__stack">
          <div className="hm-story__figure historia-story-char">
            <img
              src={assetUrl(worker.src)}
              alt={worker.alt}
              className="hm-story__img mix-blend-lighten"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </div>
          <h3 className="hm-story__name">{worker.name}</h3>
          <HistoriaWorkerStats worker={worker} variant="mobile" />
          <div className="hm-story__copy">
            <p className="historia-story-fit-text hm-story__text">{worker.tagline}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Carrusel montado solo con la pestaña activa (evita Embla en capas ocultas). */
function HistoriaMobileCarousel() {
  const [emblaRef, emblaApi, scrollTo] = useSmoothEmblaCarousel({
    axis: 'x',
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });
  const [slideIndex, setSlideIndex] = useState(0);

  useHistoriaMobileFit(true);

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

  useEffect(() => {
    if (!emblaApi) return;
    const id = requestAnimationFrame(() => emblaApi.reInit());
    return () => cancelAnimationFrame(id);
  }, [emblaApi]);

  return (
    <motion.div
      className="hm-carousel historia-mobile-carousel lg:hidden"
      role="region"
      aria-label="Historia de Reparilandia"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hm-carousel__stage">
        <div ref={emblaRef} className="hm-carousel__viewport embla-fluid overflow-hidden">
          <div className="hm-carousel__track flex h-full min-h-0 touch-pan-x">
            <div
              className="hm-slide historia-timeline-slide flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="diapositiva"
              aria-label="Línea del tiempo"
            >
              <TimelinePanel />
            </div>
            {historiaWorkers.map((worker) => (
              <div
                key={worker.src}
                className="hm-slide historia-story-slide flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full"
                role="group"
                aria-roledescription="diapositiva"
                aria-label={worker.name}
              >
                <StoryPanel worker={worker} />
              </div>
            ))}
          </div>
        </div>

        <div className="hm-carousel__foot">
          <CarouselDots
            count={SLIDE_COUNT}
            active={slideIndex}
            onSelect={scrollTo}
            className="hm-carousel__dots"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function HistoriaMobileView({ isScreenActive = true }: { isScreenActive?: boolean }) {
  useHistoriaMobileZone(isScreenActive);

  if (!isScreenActive) {
    return <div className="hm-carousel hm-carousel--idle lg:hidden" aria-hidden />;
  }

  return <HistoriaMobileCarousel />;
}
