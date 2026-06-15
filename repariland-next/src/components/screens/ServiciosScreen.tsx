import { useEffect, useState } from 'react';
import type { ElementType } from 'react';
import { motion } from 'framer-motion';
import MobileScreenLayout from '@/components/MobileScreenLayout';
import { useSmoothEmblaCarousel } from '@/hooks/useSmoothEmblaCarousel';
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
  Printer,
  Camera,
  Coffee,
  Wind,
} from 'lucide-react';
import QuoteForm from '@/components/forms/QuoteForm';
import CarouselDots from '@/components/CarouselDots';
import AppModal from '@/components/AppModal';
import { useServiciosDesktopLayout } from '@/hooks/useServiciosDesktopLayout';
import GuaranteePromise from '@/components/GuaranteePromise';
import type { Service } from '@/types';
import { assetUrl } from '@/lib/assetUrl';
import { useServiciosMobileZone } from '@/hooks/useServiciosMobileZone';

const services: Service[] = [
  {
    id: 'carritos-montables',
    icon: 'toy',
    title: 'CARRITOS MONTABLES',
    description:
      'Diagnóstico, refacciones, batería, cableado y puesta a punto de carritos montables para niños.',
    heroImage: '/assets/hero-carritos-montables-taller.png',
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
  titleLabel,
  fallbackIcon,
  priority,
}: {
  src: string;
  alt: string;
  caption: string;
  titleLabel?: string;
  fallbackIcon: ElementType;
  priority?: boolean;
}) {
  const desktopTitle = titleLabel ?? caption;
  const [heroFailed, setHeroFailed] = useState(false);

  return (
    <div className="servicios-slide-hero relative flex min-h-0 w-full flex-1 flex-col overflow-visible rounded-[inherit] bg-transparent max-lg:min-h-0 max-lg:flex-1 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
      <div className="servicios-slide-hero-media relative isolate flex min-h-0 w-full flex-1 flex-col bg-transparent max-lg:min-h-0 max-lg:flex-1 max-lg:items-center max-lg:justify-center lg:min-h-0 lg:flex-1">
        {heroFailed ? (
          <ServicioHeroIconFallback icon={fallbackIcon} />
        ) : (
          <div className="servicios-slide-hero-art relative z-[1] mx-auto flex min-h-0 w-full max-w-[min(100%,38rem)] items-center justify-center isolate rounded-lg bg-transparent px-2 py-0.5 max-lg:min-h-0 max-lg:flex-1 sm:px-2.5 lg:h-full lg:max-w-full lg:flex-1 lg:px-2 lg:py-0">
            <img
              src={assetUrl(src)}
              alt={alt}
              className="servicios-slide-hero-img block h-auto w-auto max-h-full max-w-full object-contain object-center [image-rendering:auto] drop-shadow-[0_14px_40px_rgba(0,0,0,0.28)] brightness-[1.04] contrast-[1.04] lg:h-full lg:w-full lg:min-h-0 lg:max-h-full lg:max-w-full"
              draggable={false}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              onError={() => setHeroFailed(true)}
            />
          </div>
        )}
      </div>
      <div className="servicio-hero-caption relative z-[2] hidden border-t border-cyan-400/20 bg-transparent px-2 py-1 text-center sm:px-2.5 sm:py-1.5 lg:block">
        <p className="font-orbitron text-[12px] font-bold uppercase tracking-[0.18em] text-cyan-100/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-[11px] md:text-xs lg:text-sm">
          {desktopTitle}
        </p>
      </div>
    </div>
  );
}

const SERVICIOS_ICON_ROW_FIRST = 6;

function servicioIconButtonClass(active: boolean) {
  return `servicios-icon-btn flex shrink-0 items-center justify-center rounded-lg border bg-[#12161f] transition-all touch-manipulation active:scale-95 lg:h-[4.75rem] lg:w-[4.75rem] lg:rounded-xl ${
    active
      ? 'border-cyan-400/55 ring-2 ring-cyan-400/35 shadow-[0_0_14px_rgba(34,211,238,0.25)]'
      : 'border-white/[0.1] opacity-80 hover:opacity-100'
  }`;
}

const carouselArrowInlineClass =
  'mobile-carousel-arrow flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/18 bg-black/50 text-white/95 shadow-lg backdrop-blur-md hover:bg-black/68 touch-manipulation';

const carouselArrowClass =
  'mobile-carousel-arrow absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/50 text-white/95 shadow-lg backdrop-blur-md hover:bg-black/68 touch-manipulation lg:h-10 lg:w-10';

export default function ServiciosScreen({ isScreenActive = true }: { isScreenActive?: boolean }) {
  const [quoteService, setQuoteService] = useState<string | null>(null);
  const [emblaRef, emblaApi, scrollTo, scrollPrev, scrollNext] = useSmoothEmblaCarousel({
    loop: true,
    axis: 'x',
  });
  const [slideIndex, setSlideIndex] = useState(0);

  useServiciosMobileZone(isScreenActive);
  useServiciosDesktopLayout(isScreenActive);

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
    const screen = document.querySelector('[data-screen="servicios"]');
    if (!screen) return;

    const reinit = () => {
      requestAnimationFrame(() => emblaApi.reInit());
    };

    const observer = new MutationObserver(reinit);
    observer.observe(screen, {
      attributes: true,
      attributeFilter: ['data-servicios-desktop-ready', 'data-servicios-layout-ready'],
    });

    window.addEventListener('resize', reinit);
    reinit();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', reinit);
    };
  }, [emblaApi]);

  const renderServiceIconButton = (service: Service, index: number) => {
    const Icon = iconMap[service.icon] || Wrench;
    const active = index === slideIndex;
    return (
      <button
        key={service.id}
        type="button"
        aria-label={`Ver ${service.title}`}
        aria-current={active ? 'true' : undefined}
        onClick={() => scrollTo(index)}
        className={servicioIconButtonClass(active)}
      >
        <Icon className="servicios-icon-btn__glyph text-sky-200 lg:h-[2.125rem] lg:w-[2.125rem]" strokeWidth={1.75} />
      </button>
    );
  };

  return (
    <MobileScreenLayout
      title="SERVICIOS"
      lead="Desliza o usa flechas y puntos. Toca un servicio abajo o «Cotizar» en cada slide."
      hideLeadOnMobile
      className="servicios-screen"
      data-screen="servicios"
    >
      <motion.div
        className="servicios-mobile-stage servicios-desktop-stage flex min-h-0 w-full flex-col overflow-hidden max-lg:min-h-0 max-lg:flex-1 max-lg:max-h-full max-lg:gap-2 max-lg:overflow-hidden lg:mx-auto lg:mt-0 lg:h-full lg:max-h-full lg:w-full lg:flex-1 lg:max-w-[min(100%,56rem)] lg:gap-2 lg:overflow-hidden xl:gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div className="servicios-mobile-intro flex w-full shrink-0 flex-col items-center max-lg:flex lg:hidden">
          <motion.div className="servicios-mobile-top flex w-full shrink-0 flex-col items-center px-1">
            <p className="servicios-mobile-decanos inline-flex min-h-[36px] items-center justify-center rounded-lg border border-amber-400/45 bg-amber-500/12 px-2.5 py-1 text-center font-orbitron text-[12px] font-semibold uppercase tracking-wide text-amber-100 shadow-[0_0_16px_rgba(255,215,0,0.08)] sm:min-h-[38px] sm:px-3 sm:py-1.5 sm:text-xs">
              DECANOS EN LA REPARACIÓN
            </p>
          </motion.div>
          <div className="servicios-mobile-spacer" aria-hidden />
          <motion.div className="servicios-mobile-guarantee-wrap flex w-full shrink-0 flex-col items-center px-1">
          <GuaranteePromise
            variant="compact"
            compactMessage="nos hacemos cargo de todo. (Aplica restricciones)."
            className="servicios-mobile-guarantee w-full max-w-md sm:max-w-lg"
          />
          </motion.div>
        </motion.div>

        <motion.div className="servicios-desktop-intro hidden shrink-0 flex-col items-center gap-2 px-1 lg:flex">
          <p className="servicios-desktop-decanos inline-flex min-h-[40px] items-center justify-center rounded-xl border border-amber-400/45 bg-amber-500/12 px-3.5 py-1.5 text-center font-orbitron text-xs font-semibold uppercase tracking-wide text-amber-100 shadow-[0_0_16px_rgba(255,215,0,0.08)]">
            DECANOS EN LA REPARACIÓN
          </p>
          <GuaranteePromise
            variant="compact"
            compactMessage="nos hacemos cargo de todo. (Aplica restricciones)."
            className="w-full max-w-md sm:max-w-lg"
          />
        </motion.div>

        <motion.div className="servicios-mobile-content-stack servicios-desktop-main flex min-h-0 w-full min-w-0 flex-col items-center max-lg:min-h-0 max-lg:flex-1 max-lg:justify-start max-lg:overflow-hidden max-lg:px-0 lg:min-h-0 lg:flex-1 lg:items-stretch lg:justify-start lg:gap-2 lg:overflow-hidden">
        <motion.div className="servicios-mobile-carousel-zone servicios-desktop-carousel-zone flex min-h-0 w-full min-w-0 flex-col items-center justify-center overflow-hidden max-lg:min-h-0 max-lg:w-full max-lg:max-w-[min(100%,22.5rem)] max-lg:flex-none max-lg:justify-start lg:min-h-0 lg:flex-1 lg:items-stretch lg:justify-start lg:overflow-hidden">
        <motion.div className="servicios-mobile-center-block flex w-full min-h-0 min-w-0 flex-col items-center justify-center max-lg:w-full max-lg:flex-none lg:flex lg:h-full lg:min-h-0 lg:w-full lg:max-w-full lg:flex-1 lg:items-stretch lg:justify-start">
        <div className="servicios-desktop-carousel-shell flex w-full min-h-0 max-lg:contents lg:min-h-0 lg:h-full lg:flex-1 lg:items-stretch lg:justify-center lg:gap-3 lg:px-1">
          <button
            type="button"
            aria-label="Servicio anterior"
            onClick={scrollPrev}
            className={`${carouselArrowInlineClass} servicios-desktop-carousel-arrow hidden shrink-0 lg:inline-flex`}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
        <motion.div
          className="servicios-mobile-card relative mx-auto flex min-h-0 w-full max-w-[min(100%,52rem)] flex-col overflow-hidden rounded-2xl border border-cyan-400/55 bg-hologram-darker shadow-none ring-1 ring-inset ring-cyan-400/28 max-lg:flex-none lg:min-h-0 lg:w-full lg:min-w-0 lg:max-w-[min(100%,42rem)] lg:flex-1 lg:border-cyan-400/60 lg:shadow-[0_0_56px_-6px_rgba(34,211,238,0.52),0_0_22px_-2px_rgba(34,211,238,0.32)] lg:ring-cyan-400/32"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <button type="button" aria-label="Servicio anterior" onClick={scrollPrev} className={`${carouselArrowClass} left-2 lg:hidden`}>
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <button type="button" aria-label="Servicio siguiente" onClick={scrollNext} className={`${carouselArrowClass} right-2 lg:hidden`}>
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>

          <div
            ref={emblaRef}
            className="embla-fluid servicios-mobile-embla min-h-0 overflow-hidden max-lg:min-h-0 max-lg:flex-1 lg:flex-1"
          >
            <div className="flex min-h-0 touch-pan-x max-lg:h-full lg:h-full">
              {services.map((service) => {
                const Icon = iconMap[service.icon] || Wrench;
                return (
                  <div
                    key={service.id}
                    className="servicios-mobile-slide servicios-desktop-slide flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full flex-col gap-0 overflow-hidden px-2.5 py-2 max-lg:min-h-0 max-lg:justify-start max-lg:gap-2 sm:px-3 sm:py-2.5 lg:gap-1 lg:px-4 lg:py-2.5"
                  >
                    {service.heroImage ? (
                      <div className="servicios-mobile-slide-content flex min-h-0 w-full min-w-0 flex-col gap-0 overflow-hidden max-lg:min-h-0 max-lg:flex-1 max-lg:gap-2 lg:max-w-none lg:flex-1 lg:min-h-0 lg:flex-col lg:gap-1">
                        <ServicioHeroBanner
                          src={service.heroImage}
                          alt={`Equipo Reparilandia — ${service.title}`}
                          caption={service.heroCaption ?? service.title}
                          titleLabel={service.title}
                          fallbackIcon={Icon}
                          priority={service.id === 'carritos-montables'}
                        />
                        <p className="servicios-slide-desc shrink-0 overflow-x-hidden text-balance px-1 text-center font-space text-[11px] leading-snug text-white/92 max-lg:line-clamp-4 max-lg:overflow-hidden sm:text-[12px] lg:line-clamp-2 lg:text-[13px] xl:text-sm">
                          {service.description}
                        </p>
                      </div>
                    ) : (
                      <div className="servicios-mobile-slide-content flex min-h-0 w-full min-w-0 flex-col gap-0 overflow-hidden max-lg:min-h-0 max-lg:flex-1 max-lg:gap-2 lg:max-w-none lg:flex-1 lg:min-h-0 lg:flex-col lg:gap-1">
                        <div className="servicios-slide-icon flex min-h-0 flex-col items-center justify-center gap-1 overflow-hidden py-0.5 max-lg:min-h-0 lg:flex-1">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.12] bg-[#12161f] shadow-inner sm:h-12 sm:w-12">
                            <Icon className="h-5 w-5 text-sky-300 sm:h-6 sm:w-6" strokeWidth={1.75} />
                          </div>
                          <h3 className="hidden shrink-0 text-center font-orbitron text-[12px] font-semibold tracking-[0.12em] text-white sm:text-xs lg:block">
                            {service.title}
                          </h3>
                        </div>
                        <p className="servicios-slide-desc shrink-0 overflow-x-hidden text-balance text-center font-space text-[12px] leading-snug text-white/88 max-lg:line-clamp-3 max-lg:overflow-hidden sm:text-[14px] lg:line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setQuoteService(service.title)}
                      className="servicios-slide-cta mx-auto inline-flex min-h-[30px] w-fit max-w-[calc(100%-0.5rem)] shrink-0 items-center justify-center gap-1 rounded-md border border-sky-400/35 bg-[#0f1826] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-sky-100 touch-manipulation active:scale-95 hover:bg-[#152232] sm:min-h-[32px] sm:text-[11px] lg:mt-auto lg:min-h-[28px] lg:rounded-md lg:px-3 lg:py-0.5 lg:text-[11px]"
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
          <button
            type="button"
            aria-label="Servicio siguiente"
            onClick={scrollNext}
            className={`${carouselArrowInlineClass} servicios-desktop-carousel-arrow hidden shrink-0 lg:inline-flex`}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
        </motion.div>
        </motion.div>

        <motion.div className="servicios-mobile-paginator servicios-desktop-paginator servicios-paginator-block flex w-full shrink-0 flex-col items-center gap-0 max-lg:max-w-[min(100%,22.5rem)] max-lg:pb-0 max-lg:pt-0 lg:shrink-0 lg:gap-2 lg:pb-0">
          <motion.div className="servicios-mobile-icon-grid servicios-desktop-icon-grid flex shrink-0 flex-col items-center px-1 pb-0 lg:px-0 lg:pb-0">
            <div
              className="servicios-icon-row servicios-icon-row--desktop hidden w-full max-w-full lg:flex"
              role="group"
              aria-label="Servicios"
            >
              {services.map((service, i) => renderServiceIconButton(service, i))}
            </div>
            <div className="servicios-icon-rows-mobile flex w-full flex-col items-center gap-[var(--servicios-mobile-icon-gap,0.4rem)] lg:hidden">
              <div className="servicios-icon-row" role="group" aria-label="Servicios, primera fila">
                {services.slice(0, SERVICIOS_ICON_ROW_FIRST).map((service, i) => renderServiceIconButton(service, i))}
              </div>
              <div className="servicios-icon-row servicios-icon-row--second" role="group" aria-label="Servicios, segunda fila">
                {services.slice(SERVICIOS_ICON_ROW_FIRST).map((service, i) =>
                  renderServiceIconButton(service, i + SERVICIOS_ICON_ROW_FIRST),
                )}
              </div>
            </div>
          </motion.div>

          <CarouselDots
            count={services.length}
            active={slideIndex}
            onSelect={scrollTo}
            className="servicios-mobile-dots servicios-carousel-dots flex shrink-0"
          />
        </motion.div>
        </motion.div>
      </motion.div>

      <AppModal
        open={Boolean(quoteService)}
        ariaLabel={quoteService ? `Cotización ${quoteService}` : undefined}
        windowSubtitle="Cotización"
        windowTitle={quoteService ?? undefined}
        onClose={() => setQuoteService(null)}
      >
        {quoteService ? (
          <QuoteForm serviceName={quoteService} onClose={() => setQuoteService(null)} />
        ) : null}
      </AppModal>
    </MobileScreenLayout>
  );
}
