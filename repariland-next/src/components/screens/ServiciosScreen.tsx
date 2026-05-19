import { useCallback, useEffect, useState } from 'react';
import type { ElementType } from 'react';
import { motion } from 'framer-motion';
import MobileScreenLayout from '@/components/MobileScreenLayout';
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
      className="flex min-h-[6rem] w-full flex-col items-center justify-center gap-2 py-3 sm:min-h-[7rem] md:min-h-[7.75rem]"
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
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[inherit] bg-transparent">
      <div className="relative isolate flex min-h-0 w-full flex-1 flex-col bg-transparent max-lg:max-h-[min(19cqh,5.25rem)] sm:max-h-[min(22cqh,6.5rem)] md:max-h-[min(25cqh,7.25rem)] lg:max-h-none">
        {heroFailed ? (
          <ServicioHeroIconFallback icon={fallbackIcon} />
        ) : (
          <div className="relative z-[1] mx-auto flex min-h-0 w-full max-w-[min(100%,38rem)] flex-1 justify-center isolate rounded-lg bg-transparent px-2 pt-1 sm:px-2.5 sm:pt-1.5 lg:max-w-[min(100%,44rem)] lg:px-3 lg:pt-2">
            <img
              src={assetUrl(src)}
              alt={alt}
              className="h-auto w-full max-h-full max-lg:max-h-[min(19cqh,5.25rem)] object-contain object-center pb-0.5 [image-rendering:auto] drop-shadow-[0_14px_40px_rgba(0,0,0,0.28)] brightness-[1.04] contrast-[1.04] sm:max-h-[min(22cqh,6.5rem)] md:max-h-[min(25cqh,7.25rem)] lg:max-h-[min(38cqh,18rem)] xl:max-h-[min(42cqh,20rem)]"
              draggable={false}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              onError={() => setHeroFailed(true)}
            />
          </div>
        )}
      </div>
      <div className="relative z-[2] border-t border-cyan-400/20 bg-transparent px-2 py-1 text-center sm:px-2.5 sm:py-1.5">
        <p className="font-orbitron text-[12px] font-bold uppercase tracking-[0.18em] text-cyan-100/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-[11px] md:text-xs lg:text-sm">
          {caption}
        </p>
      </div>
    </div>
  );
}

const carouselArrowClass =
  'mobile-carousel-arrow absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/50 text-white/95 shadow-lg backdrop-blur-md hover:bg-black/68 touch-manipulation lg:h-10 lg:w-10';

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
    <MobileScreenLayout
      title="SERVICIOS"
      lead="Desliza o usa flechas y puntos. Toca un servicio abajo o «Cotizar» en cada slide."
      hideLeadOnMobile
      className="servicios-screen"
    >
      <motion.div
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden max-lg:mt-3 max-lg:gap-1.5 lg:mt-6 lg:gap-1.5 xl:mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div className="flex shrink-0 justify-center">
          <motion.button
            type="button"
            onClick={() => setShowAppointment(true)}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-amber-400/45 bg-amber-500/12 px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide text-amber-100 shadow-[0_0_16px_rgba(255,215,0,0.08)] transition-colors active:scale-95 active:bg-amber-500/20 touch-manipulation sm:min-h-[38px] sm:px-3 sm:py-1.5 sm:text-xs lg:min-h-[40px] lg:gap-2 lg:rounded-xl lg:px-3.5 lg:py-1.5"
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4" />
            PROGRAMAR CITA / TOUR
          </motion.button>
        </motion.div>

        <motion.div className="flex min-h-0 flex-1 flex-col items-center justify-start gap-1 overflow-hidden max-lg:mt-2 max-lg:gap-0.5 lg:mt-4 lg:min-h-0 lg:gap-1 max-lg:mb-1 lg:mb-2 lg:translate-y-1 xl:mt-5 xl:translate-y-1.5">
        <motion.div
          className="relative mx-auto flex h-[min(48cqh,42dvh)] min-h-0 w-full max-w-[min(100%,52rem)] flex-none flex-col overflow-hidden rounded-2xl border border-cyan-400/50 bg-hologram-darker shadow-[0_0_44px_-10px_rgba(34,211,238,0.32)] ring-1 ring-inset ring-cyan-400/22 sm:h-[min(52cqh,46dvh)] lg:h-[min(50cqh,46dvh)] xl:max-w-[56rem] xl:h-[min(54cqh,50dvh)]"
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
                    className="flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full flex-col gap-0.5 overflow-hidden px-2.5 py-1.5 max-lg:gap-0.5 sm:gap-1 sm:px-3 sm:py-2 lg:gap-1.5 lg:px-4 lg:py-2"
                  >
                    {service.heroImage ? (
                      <div className="flex min-h-0 w-full flex-1 flex-col gap-1 overflow-hidden lg:max-w-none">
                        <ServicioHeroBanner
                          src={service.heroImage}
                          alt={`Equipo Reparilandia — ${service.title}`}
                          caption={service.heroCaption ?? service.title}
                          fallbackIcon={Icon}
                          priority={service.id === 'carritos-montables'}
                        />
                        <p className="line-clamp-2 shrink-0 overflow-hidden text-balance px-0.5 text-center font-space text-[11px] leading-snug text-white/92 sm:text-[12px] lg:text-[13px] xl:text-sm">
                          {service.description}
                        </p>
                      </div>
                    ) : (
                      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1 overflow-hidden py-0.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.12] bg-[#12161f] shadow-inner sm:h-12 sm:w-12">
                          <Icon className="h-5 w-5 text-sky-300 sm:h-6 sm:w-6" strokeWidth={1.75} />
                        </div>
                        <h3 className="shrink-0 text-center font-orbitron text-[12px] font-semibold tracking-[0.12em] text-white sm:text-xs">{service.title}</h3>
                        <p className="line-clamp-3 shrink-0 overflow-hidden text-balance text-center font-space text-[12px] leading-snug text-white/88 sm:text-[14px]">
                          {service.description}
                        </p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setQuoteService(service.title)}
                      className="mt-auto mx-auto inline-flex min-h-[26px] w-fit max-w-full shrink-0 items-center justify-center gap-1 rounded-md border border-sky-400/35 bg-[#0f1826] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-sky-100 touch-manipulation active:scale-95 hover:bg-[#152232] sm:min-h-[28px] sm:px-3 sm:py-1 sm:text-[10px] lg:min-h-[28px] lg:rounded-md lg:px-3 lg:py-0.5 lg:text-[11px]"
                    >
                      <Wrench className="h-3 w-3 shrink-0 text-sky-300" strokeWidth={2} />
                      {service.quoteCta ?? `Cotizar — ${service.title}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div className="flex shrink-0 flex-col items-center gap-1 max-lg:mt-2 lg:mt-3 xl:mt-4">
        <motion.div className="hidden shrink-0 flex-wrap justify-center gap-1 px-1 pb-0 sm:gap-1.5 lg:mb-0.5 lg:flex">
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
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-[#12161f] transition-all touch-manipulation active:scale-95 sm:h-12 sm:w-12 lg:h-11 lg:w-11 ${
                  active
                    ? 'border-cyan-400/55 ring-2 ring-cyan-400/35 shadow-[0_0_14px_rgba(34,211,238,0.25)]'
                    : 'border-white/[0.1] opacity-80 hover:opacity-100'
                }`}
              >
                <Icon className="h-[1.15rem] w-[1.15rem] text-sky-200 sm:h-5 sm:w-5" strokeWidth={1.75} />
              </button>
            );
          })}
        </motion.div>

        <CarouselDots
          count={services.length}
          active={slideIndex}
          onSelect={(i) => emblaApi?.scrollTo(i)}
          className="shrink-0 py-0.5 max-lg:mb-0.5 max-lg:py-0 lg:mb-0.5"
        />
        </motion.div>
      </motion.div>
      </motion.div>

      <AppModal
        open={Boolean(quoteService)}
        ariaLabel={quoteService ? `Cotización ${quoteService}` : undefined}
        windowSubtitle="Cotización"
        windowTitle={quoteService ?? undefined}
        className="lg:items-center lg:pb-[calc(var(--dock-chrome-height)+env(safe-area-inset-bottom,0px)+1.75rem)]"
        contentClassName="max-lg:-translate-y-0 lg:-translate-y-[min(6.25rem,12.5dvh)] xl:-translate-y-[min(7rem,14dvh)]"
        onClose={() => setQuoteService(null)}
      >
        {quoteService ? (
          <QuoteForm serviceName={quoteService} onClose={() => setQuoteService(null)} />
        ) : null}
      </AppModal>

      <AppModal
        open={showAppointment}
        ariaLabel="Programar cita o tour"
        windowSubtitle="Cita"
        windowTitle="Programar cita / tour"
        className="lg:items-center lg:pb-[calc(var(--dock-chrome-height)+env(safe-area-inset-bottom,0px)+1.75rem)]"
        contentClassName="max-lg:-translate-y-0 lg:-translate-y-[min(5rem,10dvh)] xl:-translate-y-[min(5.75rem,11.5dvh)]"
        onClose={() => setShowAppointment(false)}
      >
        {showAppointment ? <AppointmentForm onClose={() => setShowAppointment(false)} /> : null}
      </AppModal>
    </MobileScreenLayout>
  );
}
