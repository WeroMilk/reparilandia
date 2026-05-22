'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CarouselDots from '@/components/CarouselDots';
import { useHistoriaMobileFit } from '@/hooks/useHistoriaMobileFit';
import { useHistoriaMobileZone } from '@/hooks/useHistoriaMobileZone';
import { useSmoothEmblaCarousel } from '@/hooks/useSmoothEmblaCarousel';
import { assetUrl } from '@/lib/assetUrl';

const milestones = [
  { year: '1985', text: 'Don Jaime abre el taller con una caja de herramientas y un sueño.' },
  { year: '2000', text: 'Carlos se une al negocio familiar, trayendo visión creativa.' },
  { year: '2010', text: 'El taller evoluciona: coleccionismo y museo.' },
  { year: '2026', text: 'Dos generaciones, una pasión por reparar el pasado.' },
] as const;

const storySlides = [
  {
    src: '/assets/historia-panel-2.png',
    alt: 'Omar Lugo, integrante del equipo Reparilandia, pelo largo en ponytail',
    name: 'Omar Lugo',
    text: 'Es el genio técnico del equipo: experto en electrónica, cómputo y mecatrónica, forjado en la experiencia. Ha devuelto la vida a cámaras digitales, tarjetas madre e impresoras 3D; donde otros ven piezas irrecuperables, él ve un reto que merece resolverse.',
  },
  {
    src: '/assets/historia-panel-3.png',
    alt: 'Carlos Díaz, integrante del equipo con sombrero y barba',
    name: 'Carlos Díaz',
    text: 'Jefe y visionario, encarna la perseverancia de quien no descansa hasta dar con la solución. No se conforma mientras quede una posibilidad por explorar; su saber creció con los años, tejido de la práctica con artículos electrónicos y la tecnología que hoy llega al banco de trabajo.',
  },
  {
    src: '/assets/historia-panel-4.png',
    alt: 'Francisco Medina, integrante del equipo con gafas y playera Reparilandia',
    name: 'Francisco Medina',
    text: 'Administrador del taller, teje el día a día: proveedores, clientes, facturación, cotizaciones y la búsqueda incansable de refacciones. No cesa hasta hallar al proveedor ideal que convierta cada diagnóstico en una solución concreta.',
  },
] as const;

const SLIDE_COUNT = 1 + storySlides.length;

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
            src={assetUrl('/assets/historia-linea-tiempo.png')}
            alt=""
            className="hm-timeline__et-img historia-et-img"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="hm-timeline__copy">
          <ol className="historia-timeline-fit-copy hm-timeline__list">
            {milestones.map((m, index) => (
              <li key={m.year} className="hm-timeline__item">
                <div className="hm-timeline__marker">
                  <span className="hm-timeline__year">{m.year}</span>
                  {index < milestones.length - 1 ? (
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

function StoryPanel({
  src,
  alt,
  name,
  text,
}: {
  src: string;
  alt: string;
  name: string;
  text: string;
}) {
  return (
    <article className="hm-panel hm-panel--story historia-panel">
      <div className="hm-panel__main hm-story">
        <div className="hm-story__stack">
          <div className="hm-story__figure historia-story-char">
            <img
              src={assetUrl(src)}
              alt={alt}
              className="hm-story__img mix-blend-lighten"
              draggable={false}
              loading="eager"
              decoding="async"
            />
          </div>
          <h3 className="hm-story__name">{name}</h3>
          <div className="hm-story__copy">
            <p className="historia-story-fit-text hm-story__text">{text}</p>
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
            {storySlides.map((slide) => (
              <div
                key={slide.src}
                className="hm-slide historia-story-slide flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full"
                role="group"
                aria-roledescription="diapositiva"
                aria-label={slide.name}
              >
                <StoryPanel {...slide} />
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
