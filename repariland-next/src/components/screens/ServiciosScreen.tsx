import { useCallback, useEffect, useState } from 'react';
import type { ElementType } from 'react';
import { motion } from 'framer-motion';
import ScreenPageTitle from '@/components/ScreenPageTitle';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ChevronLeft,
  ChevronRight,
  Laptop,
  Monitor,
  Gamepad2,
  ToyBrick,
  Stethoscope,
  MoreHorizontal,
  Wrench,
  Calendar,
  Printer,
  Camera,
  Coffee,
  Wind,
} from 'lucide-react';
import QuoteForm from '@/components/forms/QuoteForm';
import AppointmentForm from '@/components/forms/AppointmentForm';
import CarouselDots from '@/components/CarouselDots';
import AppModal from '@/components/AppModal';
import type { Service } from '@/types';
import { assetUrl } from '@/lib/assetUrl';

const services: Service[] = [
  {
    id: 'carritos-montables',
    icon: 'toy',
    title: 'CARRITOS MONTABLES',
    description:
      'Diagnóstico, refacciones, batería, cableado y puesta a punto de carritos montables para niños.',
    heroImage: '/assets/hero-reparamos-carritos.png',
    heroCaption: 'Reparamos carritos montables',
    quoteCta: 'Cotizar servicio',
  },
  {
    id: 'laptops',
    icon: 'laptop',
    title: 'LAPTOPS',
    description: 'Hardware, pantalla, teclado, batería, limpieza y optimización.',
    heroImage: '/assets/hero-servicio-laptops.png',
  },
  {
    id: 'pc-escritorio',
    icon: 'monitor',
    title: 'PC ESCRITORIO',
    description: 'Mantenimiento, ensamblaje, upgrades y refrigeración.',
    heroImage: '/assets/hero-servicio-pc.png',
  },
  {
    id: 'consolas',
    icon: 'gamepad',
    title: 'CONSOLAS',
    description: 'De Atari a PS5: lector óptico, HDMI, sobrecalentamiento y consolas con fallo de sistema.',
    heroImage: '/assets/hero-servicio-consolas.png',
  },
  {
    id: 'juguetes',
    icon: 'toy',
    title: 'JUGUETES',
    description: 'Electrónicos, robótica, trenes y piezas con historia.',
    heroImage: '/assets/hero-servicio-juguetes.png',
  },
  {
    id: 'diagnostico',
    icon: 'stethoscope',
    title: 'DIAGNÓSTICO',
    description: 'Evaluación profesional y presupuesto sin compromiso.',
    heroImage: '/assets/hero-servicio-diagnostico.png',
  },
  {
    id: 'impresoras',
    icon: 'printer',
    title: 'IMPRESORAS',
    description: 'Inkjet, láser y multifuncionales: cabezales, alimentación, firmware y mantenimiento.',
    heroImage: '/assets/hero-servicio-impresoras.png',
  },
  {
    id: 'camaras',
    icon: 'camera',
    title: 'CÁMARAS FOTOGRÁFICAS',
    description: 'Réflex, compactas y digitales: obturador, lente, sensor, flash y conectividad.',
    heroImage: '/assets/hero-servicio-camaras.png',
  },
  {
    id: 'cafeteras',
    icon: 'coffee',
    title: 'CAFETERAS',
    description: 'Express, goteo y cápsulas: bombas, resistencias, circuitos y calibración.',
    heroImage: '/assets/hero-servicio-cafeteras.png',
  },
  {
    id: 'aspiradoras',
    icon: 'vacuum',
    title: 'ASPIRADORAS',
    description: 'Domésticas e industriales: motor, succión, cableado y sistemas electrónicos.',
    heroImage: '/assets/hero-servicio-aspiradoras.png',
  },
  {
    id: 'otros',
    icon: 'more',
    title: 'OTROS',
    description: 'Audio, proyectores, electrodomésticos y tecnología retro con historia.',
    heroImage: '/assets/hero-servicio-otros.png',
  },
];

const iconMap: Record<string, ElementType> = {
  laptop: Laptop,
  monitor: Monitor,
  gamepad: Gamepad2,
  toy: ToyBrick,
  stethoscope: Stethoscope,
  printer: Printer,
  camera: Camera,
  coffee: Coffee,
  vacuum: Wind,
  more: MoreHorizontal,
};

function ServicioHeroIconFallback({ icon: Icon }: { icon: ElementType }) {
  return (
    <div
      className="flex min-h-[7.5rem] w-full flex-col items-center justify-center gap-2 py-4 sm:min-h-[8.5rem] md:min-h-[9.5rem]"
      aria-hidden
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.12] bg-[#12161f] shadow-inner sm:h-16 sm:w-16">
        <Icon className="h-7 w-7 text-sky-300 sm:h-8 sm:w-8" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function ServicioHeroBanner({
  src,
  alt,
  caption,
  fallbackIcon,
  priority,
}: {
  src: string;
  alt: string;
  caption: string;
  fallbackIcon: ElementType;
  priority?: boolean;
}) {
  const [heroFailed, setHeroFailed] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-[inherit] bg-transparent">
      <div className="relative isolate w-full min-h-[7.5rem] bg-transparent sm:min-h-[8.5rem] md:min-h-[9.5rem]">
        {heroFailed ? (
          <ServicioHeroIconFallback icon={fallbackIcon} />
        ) : (
          <div className="relative z-[1] mx-auto flex w-full max-w-[min(100%,40rem)] justify-center isolate rounded-lg bg-transparent px-2 pt-1.5 sm:px-3 sm:pt-2">
            <img
              src={assetUrl(src)}
              alt={alt}
              className="h-auto w-full max-h-[min(28dvh,11.5rem)] object-contain object-center pb-0.5 [image-rendering:auto] drop-shadow-[0_14px_40px_rgba(0,0,0,0.28)] brightness-[1.04] contrast-[1.04] sm:max-h-[min(30dvh,12.5rem)] md:max-h-[min(32dvh,13.5rem)]"
              draggable={false}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              onError={() => setHeroFailed(true)}
            />
          </div>
        )}
      </div>
      <div className="relative z-[2] border-t border-cyan-400/20 bg-transparent px-2 py-1.5 text-center sm:px-3 sm:py-2">
        <p className="font-orbitron text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-100/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-xs md:text-sm">
          {caption}
        </p>
      </div>
    </div>
  );
}

const carouselArrowClass =
  'mobile-carousel-arrow absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/50 text-white/95 shadow-lg backdrop-blur-md hover:bg-black/68 touch-manipulation sm:h-10 sm:w-10';

export default function ServiciosScreen() {
  const [quoteService, setQuoteService] = useState<string | null>(null);
  const [showAppointment, setShowAppointment] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, axis: 'x', duration: 22 });
  const [slideIndex, setSlideIndex] = useState(0);

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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <motion.div className="screen-shell flex min-h-0 flex-1 flex-col overflow-hidden">
      <ScreenPageTitle>SERVICIOS</ScreenPageTitle>
      <p className="screen-page-lead">
        Desliza o usa flechas y puntos. Toca un servicio abajo o «Cotizar» en cada slide.
      </p>

      <motion.div
        className="mt-2.5 flex shrink-0 translate-y-1.5 justify-center sm:mt-3.5 sm:translate-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.06 }}
      >
        <motion.button
          type="button"
          onClick={() => setShowAppointment(true)}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-amber-400/45 bg-amber-500/12 px-3 py-1.5 text-[clamp(0.5625rem,2.4vw,0.625rem)] font-semibold tracking-wide text-amber-100 shadow-[0_0_16px_rgba(255,215,0,0.08)] transition-colors active:scale-95 active:bg-amber-500/20 touch-manipulation sm:text-[10px]"
          whileTap={{ scale: 0.98 }}
        >
          <Calendar className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          PROGRAMAR CITA / TOUR
        </motion.button>
      </motion.div>

      <div className="mt-1.5 flex min-h-0 flex-1 flex-col justify-center gap-1.5 overflow-hidden pb-0 sm:mt-2 sm:gap-2">
        <motion.div
          className="relative mx-auto flex h-[min(40dvh,19.5rem)] w-full max-w-4xl shrink-0 flex-col overflow-hidden rounded-2xl border border-cyan-400/50 bg-hologram-darker shadow-[0_0_44px_-10px_rgba(34,211,238,0.32)] ring-1 ring-inset ring-cyan-400/22 sm:h-[min(44dvh,22rem)] md:h-[min(48dvh,24rem)] lg:h-[min(50dvh,25.5rem)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <button type="button" aria-label="Servicio anterior" onClick={scrollPrev} className={`${carouselArrowClass} left-2`}>
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <button type="button" aria-label="Servicio siguiente" onClick={scrollNext} className={`${carouselArrowClass} right-2`}>
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>

          <div ref={emblaRef} className="min-h-0 flex-1 overflow-hidden">
            <div className="flex h-full touch-pan-x">
              {services.map((service) => {
                const Icon = iconMap[service.icon] || Wrench;
                return (
                  <div
                    key={service.id}
                    className="flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full flex-col items-center justify-center gap-2 overflow-y-auto px-3 py-2 sm:gap-2.5 sm:px-4 sm:py-2.5"
                  >
                    {service.heroImage ? (
                      <div className="flex w-full max-w-2xl shrink-0 flex-col gap-2">
                        <ServicioHeroBanner
                          src={service.heroImage}
                          alt={`Equipo Reparilandia — ${service.title}`}
                          caption={service.heroCaption ?? service.title}
                          fallbackIcon={Icon}
                          priority={service.id === 'carritos-montables'}
                        />
                        <p className="text-balance px-1 text-center font-space text-[11px] leading-relaxed text-white/85 sm:text-sm">
                          {service.description}
                        </p>
                      </div>
                    ) : (
                      <div className="flex w-full max-w-md flex-col items-center gap-3 py-2">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.12] bg-[#12161f] shadow-inner sm:h-16 sm:w-16">
                          <Icon className="h-7 w-7 text-sky-300 sm:h-8 sm:w-8" strokeWidth={1.75} />
                        </div>
                        <h3 className="text-center font-orbitron text-sm font-semibold tracking-[0.14em] text-white sm:text-base">{service.title}</h3>
                        <p className="text-balance text-center font-space text-[11px] leading-relaxed text-white/85 sm:text-sm">{service.description}</p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setQuoteService(service.title)}
                      className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-sky-400/35 bg-[#0f1826] px-4 py-2 text-[clamp(0.6875rem,2.6vw,0.75rem)] font-semibold tracking-wide text-sky-100 touch-manipulation active:scale-95 hover:bg-[#152232] sm:min-h-[40px] sm:text-xs"
                    >
                      <Wrench className="h-4 w-4 shrink-0 text-sky-300" strokeWidth={2} />
                      {service.quoteCta ?? `Cotizar — ${service.title}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="flex shrink-0 justify-center gap-1.5 overflow-x-auto px-1 pb-0 scrollbar-hide sm:gap-2">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Wrench;
            const active = i === slideIndex;
            return (
              <button
                key={service.id}
                type="button"
                aria-label={`Ver ${service.title}`}
                aria-current={active ? 'true' : undefined}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-[#12161f] transition-all touch-manipulation active:scale-95 sm:h-11 sm:w-11 ${
                  active
                    ? 'border-cyan-400/55 ring-2 ring-cyan-400/35 shadow-[0_0_14px_rgba(34,211,238,0.25)]'
                    : 'border-white/[0.1] opacity-80 hover:opacity-100'
                }`}
              >
                <Icon className="h-[1.15rem] w-[1.15rem] text-sky-200 sm:h-5 sm:w-5" strokeWidth={1.75} />
              </button>
            );
          })}
        </div>

        <CarouselDots count={services.length} active={slideIndex} onSelect={(i) => emblaApi?.scrollTo(i)} className="shrink-0" />
      </div>

      <AppModal
        open={Boolean(quoteService)}
        ariaLabel={quoteService ? `Cotización ${quoteService}` : undefined}
        contentClassName="-translate-y-3 sm:-translate-y-4"
        onClose={() => setQuoteService(null)}
      >
        {quoteService ? (
          <QuoteForm serviceName={quoteService} onClose={() => setQuoteService(null)} />
        ) : null}
      </AppModal>

      <AppModal
        open={showAppointment}
        ariaLabel="Programar cita o tour"
        contentClassName="-translate-y-3 sm:-translate-y-4"
        onClose={() => setShowAppointment(false)}
      >
        {showAppointment ? <AppointmentForm onClose={() => setShowAppointment(false)} /> : null}
      </AppModal>
    </motion.div>
  );
}
