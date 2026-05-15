import { useCallback, useEffect, useState } from 'react';
import type { ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScreenPageTitle from '@/components/ScreenPageTitle';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Laptop, Monitor, Gamepad2, ToyBrick, Stethoscope, MoreHorizontal, Wrench, Calendar } from 'lucide-react';
import QuoteForm from '@/components/forms/QuoteForm';
import AppointmentForm from '@/components/forms/AppointmentForm';
import CarouselDots from '@/components/CarouselDots';
import type { Service } from '@/types';
import { assetUrl } from '@/lib/assetUrl';

const services: Service[] = [
  {
    id: 'carritos-montables',
    icon: 'toy',
    title: 'CARRITOS MONTABLES',
    description:
      'Diagnóstico, refacciones, batería, cableado y puesta a punto de carritos montables para niños.',
    heroCarritos: true,
    quoteCta: 'Cotizar servicio',
  },
  {
    id: 'laptops',
    icon: 'laptop',
    title: 'LAPTOPS',
    description: 'Hardware, pantalla, teclado, batería, limpieza y optimización.',
  },
  {
    id: 'pc-escritorio',
    icon: 'monitor',
    title: 'PC ESCRITORIO',
    description: 'Mantenimiento, ensamblaje, upgrades y refrigeración.',
  },
  {
    id: 'consolas',
    icon: 'gamepad',
    title: 'CONSOLAS',
    description: 'De Atari a PS5: lector óptico, HDMI, sobrecalentamiento y consolas con fallo de sistema.',
  },
  {
    id: 'juguetes',
    icon: 'toy',
    title: 'JUGUETES',
    description: 'Electrónicos, robótica, trenes y piezas con historia.',
  },
  {
    id: 'diagnostico',
    icon: 'stethoscope',
    title: 'DIAGNÓSTICO',
    description: 'Evaluación profesional y presupuesto sin compromiso.',
  },
  {
    id: 'otros',
    icon: 'more',
    title: 'OTROS',
    description: 'Cámaras, audio, proyectores y tecnología retro.',
  },
];

const iconMap: Record<string, ElementType> = {
  laptop: Laptop,
  monitor: Monitor,
  gamepad: Gamepad2,
  toy: ToyBrick,
  stethoscope: Stethoscope,
  more: MoreHorizontal,
};

const DEFAULT_HERO =
  (process.env.NEXT_PUBLIC_SERVICIOS_HERO_IMAGE as string | undefined)?.trim() ||
  '/assets/hero-reparamos-carritos.png';

function StarWarsHeroFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-90" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-black" />
      <div className="absolute bottom-[12%] left-1/2 h-[28%] w-[42%] -translate-x-1/2 rounded-lg border border-white/10 bg-zinc-800/80 shadow-inner">
        <ToyBrick className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 text-amber-300/90" strokeWidth={1.25} />
      </div>
      <svg className="absolute bottom-[8%] left-[8%] h-[55%] w-[22%] text-zinc-300/55" viewBox="0 0 60 100" fill="currentColor">
        <ellipse cx="30" cy="28" rx="22" ry="26" />
        <rect x="14" y="50" width="32" height="40" rx="6" />
      </svg>
      <svg className="absolute bottom-[8%] right-[8%] h-[55%] w-[22%] text-zinc-400/55" viewBox="0 0 60 100" fill="currentColor">
        <ellipse cx="30" cy="28" rx="22" ry="26" />
        <rect x="14" y="50" width="32" height="40" rx="6" />
      </svg>
    </div>
  );
}

function ServiciosHeroBanner() {
  const heroSrc = DEFAULT_HERO;
  const [heroFailed, setHeroFailed] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-[inherit] bg-transparent">
      <div className="relative isolate w-full min-h-[7.5rem] bg-transparent sm:min-h-[8.5rem] md:min-h-[9.5rem]">
        {heroFailed ? (
          <div className="relative min-h-[7.5rem] w-full sm:min-h-[8.5rem] md:min-h-[9.5rem]">
            <StarWarsHeroFallback />
          </div>
        ) : (
          <div className="relative z-[1] mx-auto flex w-full max-w-[min(100%,40rem)] justify-center isolate rounded-lg bg-hologram-darker px-2 pt-1.5 sm:px-3 sm:pt-2">
            <img
              src={assetUrl(heroSrc)}
              alt="Equipo Reparilandia reparando carritos montables"
              className="h-auto w-full max-h-[min(28dvh,11.5rem)] object-contain object-center pb-0.5 [image-rendering:auto] mix-blend-screen brightness-[1.08] contrast-[1.06] drop-shadow-[0_14px_40px_rgba(0,0,0,0.28)] sm:max-h-[min(30dvh,12.5rem)] md:max-h-[min(32dvh,13.5rem)]"
              draggable={false}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onError={() => setHeroFailed(true)}
            />
          </div>
        )}
      </div>
      <div className="relative z-[2] border-t border-cyan-400/20 bg-transparent px-2 py-1.5 text-center sm:px-3 sm:py-2">
        <p className="font-orbitron text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-100/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-xs md:text-sm">
          Reparamos carritos montables
        </p>
      </div>
    </div>
  );
}

const carouselArrowClass =
  'absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/50 text-white/95 shadow-lg backdrop-blur-md hover:bg-black/68 touch-manipulation sm:h-10 sm:w-10';

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
        className="mt-1.5 flex shrink-0 justify-center sm:mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.06 }}
      >
        <motion.button
          type="button"
          onClick={() => setShowAppointment(true)}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-amber-400/45 bg-amber-500/12 px-3 py-1.5 text-[9px] font-semibold tracking-wide text-amber-100 shadow-[0_0_16px_rgba(255,215,0,0.08)] transition-colors active:bg-amber-500/20 touch-manipulation sm:text-[10px]"
          whileTap={{ scale: 0.98 }}
        >
          <Calendar className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          PROGRAMAR CITA / TOUR
        </motion.button>
      </motion.div>

      <div className="mt-1.5 flex min-h-0 flex-1 flex-col justify-center gap-1.5 overflow-hidden pb-0 sm:mt-2 sm:gap-2">
        <motion.div
          className="relative mx-auto flex h-[min(46dvh,22.5rem)] w-full max-w-4xl shrink-0 flex-col overflow-hidden rounded-2xl border border-cyan-400/50 bg-hologram-darker shadow-[0_0_44px_-10px_rgba(34,211,238,0.32)] ring-1 ring-inset ring-cyan-400/22 sm:h-[min(48dvh,24rem)] lg:h-[min(50dvh,25.5rem)]"
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
                    {service.heroCarritos ? (
                      <div className="w-full max-w-2xl shrink-0">
                        <ServiciosHeroBanner />
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
                      className="flex min-h-[38px] shrink-0 items-center gap-2 rounded-xl border border-sky-400/35 bg-[#0f1826] px-4 py-2 text-[11px] font-semibold tracking-wide text-sky-100 touch-manipulation hover:bg-[#152232] sm:min-h-[40px] sm:text-xs"
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
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-[#12161f] transition-all touch-manipulation sm:h-11 sm:w-11 ${
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

      <AnimatePresence>
        {quoteService && (
          <motion.div
            className="fixed inset-0 z-[10070] flex items-center justify-center overflow-hidden p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:p-4 safe-pbDock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuoteService(null)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
            <div
              className="relative z-[1] flex max-h-full w-full max-w-2xl min-h-0 items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <QuoteForm serviceName={quoteService} onClose={() => setQuoteService(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAppointment && (
          <motion.div
            className="fixed inset-0 z-[10070] flex items-center justify-center overflow-hidden p-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-[max(0.5rem,env(safe-area-inset-top,0px))] sm:p-3 safe-pbDock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAppointment(false)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
            <div
              className="relative z-[1] flex max-h-full w-full max-w-2xl min-h-0 items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AppointmentForm onClose={() => setShowAppointment(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
