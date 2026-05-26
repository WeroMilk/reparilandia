'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import MobileScreenLayout from '@/components/MobileScreenLayout';
import CarouselDots from '@/components/CarouselDots';
import GuaranteePromise from '@/components/GuaranteePromise';
import type { ScreenName } from '@/types';
import { assetUrl } from '@/lib/assetUrl';
import { useInicioDesktopLayout } from '@/hooks/useInicioDesktopLayout';
import { useInicioMobileBoxesZone } from '@/hooks/useInicioMobileBoxesZone';
import { useSmoothEmblaCarousel } from '@/hooks/useSmoothEmblaCarousel';

const LOGO = '/assets/logo-reparilandia.png';

const IMG_CARRITOS = '/assets/home-box-carritos.png';
const IMG_SERVICIO = '/assets/home-box-servicio.png';
const IMG_NOVEDADES = '/assets/home-box-novedades.png';

const CARD_BOX =
  'flex h-full min-h-0 w-full max-h-full flex-col lg:min-h-0 lg:max-h-full';

const homeCards = [
  {
    img: IMG_CARRITOS,
    caption: 'Reparamos Carritos Montables (niños)',
    screen: 'servicios' as ScreenName,
    accent: 'green' as const,
  },
  {
    img: IMG_SERVICIO,
    caption: 'Servicio y Mantenimiento 100% Personalizado.',
    screen: 'servicios' as ScreenName,
    accent: 'amber' as const,
    centerProminent: true,
  },
  {
    img: IMG_NOVEDADES,
    caption: 'Espera novedades. Próximamente…',
    screen: 'noticias' as ScreenName,
    accent: 'red' as const,
  },
];

type HomeBoxAccent = 'green' | 'amber' | 'red';

/** Móvil: proporciones por acento; escritorio: rellena el área con object-contain (CSS). */
const HOME_BOX_IMG_CLASS: Record<
  HomeBoxAccent,
  { mobile: string; desktop: string }
> = {
  green: {
    mobile: 'mx-auto block h-auto w-auto max-h-full max-w-full object-contain object-center',
    desktop:
      'inicio-home-card__img pointer-events-none mx-auto block h-auto w-auto max-h-[min(13rem,62cqh)] max-w-[98%] object-contain object-center select-none [image-rendering:auto]',
  },
  amber: {
    mobile: 'mx-auto block h-auto w-auto max-h-full max-w-full object-contain object-center',
    desktop:
      'inicio-home-card__img pointer-events-none mx-auto block h-auto w-auto max-h-[min(13rem,62cqh)] max-w-[98%] object-contain object-center select-none [image-rendering:auto]',
  },
  red: {
    mobile: 'mx-auto block h-auto w-auto max-h-full max-w-full object-contain object-center',
    desktop:
      'inicio-home-card__img pointer-events-none mx-auto block h-auto w-auto max-h-[min(13rem,62cqh)] max-w-[98%] object-contain object-center select-none [image-rendering:auto]',
  },
};

const HOME_BOX_ACCENT: Record<
  HomeBoxAccent,
  { restShadow: string; frame: string; innerSheen: string }
> = {
  green: {
    restShadow:
      'shadow-[0_12px_40px_-20px_rgba(0,0,0,0.72),0_0_26px_-12px_rgba(120,255,100,0.22)]',
    frame:
      'border-[rgba(120,255,100,0.38)] ring-[rgba(90,235,120,0.22)] hover:border-[rgba(140,255,120,0.72)] hover:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.65),0_0_32px_-10px_rgba(100,255,120,0.48)] hover:ring-[rgba(120,255,130,0.5)] focus-visible:border-[rgba(140,255,120,0.72)] focus-visible:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.65),0_0_30px_-10px_rgba(100,255,120,0.4)] focus-visible:ring-[rgba(120,255,130,0.45)] active:border-[rgba(160,255,140,0.85)] active:ring-[rgba(130,255,150,0.58)]',
    innerSheen:
      'bg-[radial-gradient(ellipse_92%_68%_at_50%_32%,rgba(130,255,120,0.15)_0%,rgba(80,235,100,0.08)_34%,rgba(50,210,80,0.03)_48%,transparent_62%)]',
  },
  amber: {
    restShadow:
      'shadow-[0_12px_40px_-20px_rgba(0,0,0,0.72),0_0_26px_-12px_rgba(255,220,60,0.2)]',
    frame:
      'border-[rgba(255,238,75,0.4)] ring-[rgba(255,200,50,0.22)] hover:border-[rgba(255,238,90,0.78)] hover:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.65),0_0_32px_-10px_rgba(255,210,50,0.46)] hover:ring-[rgba(255,230,80,0.52)] focus-visible:border-[rgba(255,238,90,0.78)] focus-visible:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.65),0_0_30px_-10px_rgba(255,200,45,0.4)] focus-visible:ring-[rgba(255,230,80,0.48)] active:border-[rgba(255,245,120,0.9)] active:ring-[rgba(255,220,70,0.6)]',
    innerSheen:
      'bg-[radial-gradient(ellipse_92%_68%_at_50%_32%,rgba(255,238,75,0.14)_0%,rgba(255,185,45,0.08)_34%,rgba(255,140,50,0.03)_48%,transparent_62%)]',
  },
  red: {
    restShadow:
      'shadow-[0_12px_40px_-20px_rgba(0,0,0,0.72),0_0_28px_-12px_rgba(255,90,110,0.22)]',
    frame:
      'border-[rgba(255,100,120,0.4)] ring-[rgba(255,70,95,0.22)] hover:border-[rgba(255,120,140,0.75)] hover:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.65),0_0_32px_-10px_rgba(255,80,105,0.48)] hover:ring-[rgba(255,110,130,0.5)] focus-visible:border-[rgba(255,120,140,0.75)] focus-visible:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.65),0_0_30px_-10px_rgba(255,75,100,0.4)] focus-visible:ring-[rgba(255,110,130,0.45)] active:border-[rgba(255,140,155,0.88)] active:ring-[rgba(255,90,115,0.58)]',
    innerSheen:
      'bg-[radial-gradient(ellipse_92%_68%_at_50%_32%,rgba(255,120,140,0.14)_0%,rgba(255,70,95,0.08)_34%,rgba(220,40,70,0.03)_48%,transparent_62%)]',
  },
};

interface InicioScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isScreenActive?: boolean;
}

export default function InicioScreen({ onNavigate, isScreenActive = true }: InicioScreenProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [emblaRef, emblaApi, scrollTo] = useSmoothEmblaCarousel({
    loop: true,
    axis: 'x',
    align: 'start',
    containScroll: 'trimSnaps',
  });

  useInicioMobileBoxesZone(isScreenActive);
  useInicioDesktopLayout(isScreenActive);

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
    const screen = document.querySelector('[data-screen="inicio"]');
    if (!screen) return;

    const reinit = () => {
      requestAnimationFrame(() => emblaApi.reInit());
    };

    const observer = new MutationObserver(reinit);
    observer.observe(screen, {
      attributes: true,
      attributeFilter: ['data-inicio-layout-ready'],
    });
    window.addEventListener('resize', reinit);
    reinit();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', reinit);
    };
  }, [emblaApi]);

  return (
    <MobileScreenLayout title="INICIO" className="inicio-screen" data-screen="inicio">
      <motion.div className="inicio-mobile-stage relative flex min-h-0 flex-1 flex-col overflow-hidden max-lg:min-h-0 max-lg:gap-0.5 max-lg:overflow-hidden max-lg:pb-0 lg:min-h-0 lg:flex-1 lg:flex-col lg:justify-start lg:gap-0 lg:overflow-visible lg:pb-0">
        {/* Móvil: logo → eslogan → garantía con huecos; escritorio sin cambios */}
        <motion.div
          className="inicio-mobile-top relative z-10 flex w-full shrink-0 flex-col items-center text-center lg:hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inicio-mobile-brand flex w-full flex-col items-center">
            <div className="inicio-mobile-logo-wrap w-full">
              <Image
                src={assetUrl(LOGO)}
                alt="Reparilandia"
                width={1024}
                height={682}
                priority
                quality={100}
                placeholder="empty"
                sizes="(max-width: 1023px) min(96vw, 40rem)"
                className="inicio-mobile-logo mx-auto block h-auto w-full max-w-[min(96vw,40rem)] bg-transparent object-contain object-center [image-rendering:auto] drop-shadow-[0_14px_48px_rgba(0,0,0,0.45)]"
                draggable={false}
              />
            </div>
            <p className="inicio-mobile-slogan max-w-xl px-3 font-orbitron text-[clamp(0.6875rem,2.8vw,0.875rem)] font-medium leading-none tracking-[0.14em] text-cyan-100/95 drop-shadow-[0_0_20px_rgba(34,211,238,0.22)] sm:text-sm sm:tracking-[0.22em]">
              La capital de la reparación
            </p>
          </div>
          <GuaranteePromise className="inicio-mobile-guarantee w-full" />
        </motion.div>

        <motion.div
          className="inicio-mobile-hero inicio-desktop-hero relative z-10 hidden w-full shrink-0 flex-col items-center gap-1 px-1 text-center sm:px-2 lg:flex lg:max-h-none lg:gap-2 lg:pt-0 xl:gap-2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inicio-desktop-brand flex w-full flex-col items-center lg:gap-1 xl:gap-1.5">
            <Image
              src={assetUrl(LOGO)}
              alt="Reparilandia"
              width={1024}
              height={682}
              priority
              quality={100}
              placeholder="empty"
              sizes="(max-width: 1023px) min(94vw, 38rem), min(92vw, 62rem)"
              className="inicio-desktop-logo mx-auto block h-auto w-full max-h-[min(26dvh,14.5rem)] max-w-[min(94vw,36rem)] bg-transparent object-contain object-center [image-rendering:auto] drop-shadow-[0_14px_48px_rgba(0,0,0,0.45)] sm:max-h-[min(28dvh,15.5rem)] sm:max-w-[min(94vw,38rem)] md:max-h-[min(29dvh,16.25rem)] md:max-w-[min(92vw,40rem)] lg:max-h-[min(30dvh,18.5rem)] lg:max-w-[min(90vw,54rem)] xl:max-h-[min(32dvh,20.5rem)] xl:max-w-[min(88vw,58rem)]"
              draggable={false}
            />
            <p className="inicio-desktop-slogan max-w-xl px-3 font-orbitron text-[clamp(0.6875rem,2.8vw,0.875rem)] font-medium leading-none tracking-[0.14em] text-cyan-100/95 drop-shadow-[0_0_20px_rgba(34,211,238,0.22)] sm:text-sm sm:tracking-[0.22em] lg:mb-0 lg:w-full lg:text-base lg:tracking-[0.24em] xl:text-lg xl:tracking-[0.26em]">
              La capital de la reparación
            </p>
          </div>
        </motion.div>

        {/* Móvil: carrusel horizontal — un box completo (imagen + leyenda) por slide */}
        <motion.div
          className="inicio-mobile-boxes inicio-mobile-carousel flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden max-lg:min-h-0 max-lg:flex-1 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inicio-mobile-center-block flex w-full min-h-0 flex-1 flex-col items-center justify-start overflow-hidden">
            <div
              ref={emblaRef}
              className="embla-fluid inicio-mobile-embla min-h-0 w-full flex-1 overflow-hidden"
              aria-label="Destacados Reparilandia"
            >
              <div className="flex h-full min-h-0 touch-pan-x">
                {homeCards.map((card) => (
                  <div
                    key={card.img}
                    className="inicio-mobile-slide min-w-0 shrink-0 grow-0 basis-full"
                  >
                    <div className="inicio-mobile-slide__inner">
                      <HomeSpotlightCard
                        img={card.img}
                        caption={card.caption}
                        onClick={() => onNavigate(card.screen)}
                        accent={card.accent}
                        centerProminent={card.centerProminent}
                        mobileCarousel
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="inicio-mobile-carousel-foot flex w-full shrink-0 flex-col items-center">
            <CarouselDots
              count={homeCards.length}
              active={slideIndex}
              onSelect={scrollTo}
              className="inicio-mobile-dots"
            />
          </div>
        </motion.div>

        {/* Escritorio: garantía + 3 boxes anclados al dock */}
        <motion.div
          className="inicio-desktop-even hidden min-h-0 w-full flex-col items-center justify-start gap-2 overflow-visible lg:flex lg:min-h-0 lg:flex-1 lg:gap-3 xl:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.04, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div className="inicio-desktop-trust flex w-full shrink-0 flex-col items-center">
            <GuaranteePromise className="inicio-desktop-guarantee w-full" />
          </motion.div>
          <motion.div
            className="inicio-desktop-boxes relative z-[1] mx-auto grid w-full max-w-6xl min-h-0 flex-1 grid-cols-3 grid-rows-1 items-stretch justify-items-stretch gap-3 overflow-visible px-0 lg:auto-rows-fr xl:max-w-[72rem] xl:gap-3.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {homeCards.map((card) => (
              <motion.div key={card.img} className="flex h-full min-h-0 min-w-0 flex-col">
                <HomeSpotlightCard
                  img={card.img}
                  caption={card.caption}
                  onClick={() => onNavigate(card.screen)}
                  accent={card.accent}
                  centerProminent={card.centerProminent}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <h1 className="sr-only">Reparilandia</h1>
    </MobileScreenLayout>
  );
}

function HomeSpotlightCard({
  img,
  caption,
  onClick,
  accent,
  centerProminent = false,
  cropLegs = false,
  mobileScroll = false,
  mobileCarousel = false,
}: {
  img: string;
  caption: string;
  onClick: () => void;
  accent: HomeBoxAccent;
  centerProminent?: boolean;
  cropLegs?: boolean;
  mobileScroll?: boolean;
  mobileCarousel?: boolean;
}) {
  const styles = HOME_BOX_ACCENT[accent];
  const mobileLayout = mobileCarousel || mobileScroll;

  const imgTreat = mobileLayout
    ? `inicio-home-card__img ${HOME_BOX_IMG_CLASS[accent].mobile}`
    : HOME_BOX_IMG_CLASS[accent].desktop;

  const wrapAlign = centerProminent
    ? 'items-center justify-center pt-1'
    : 'items-center justify-center py-0.5';

  const cardChrome =
    'bg-black ring-1 ring-inset transition-[border-color,box-shadow,ring-color] duration-200';

  const glowStage = `home-box-glow home-box-glow--${accent}${
    centerProminent ? ' home-box-glow--center' : ''
  }`;

  const imageShell = 'inicio-home-card__art min-h-0 w-full flex-1';

  const imageArea = cropLegs ? (
    <motion.div
      className={`relative mx-auto overflow-hidden rounded-lg ${imageShell} ${glowStage}`}
    >
      <img
        src={assetUrl(img)}
        alt=""
        className="relative z-[1] pointer-events-none absolute left-1/2 top-0 block h-[138%] w-auto max-w-[96%] -translate-x-1/2 select-none object-cover object-top"
        style={{ objectPosition: 'center 14%' }}
        draggable={false}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </motion.div>
  ) : (
    <motion.div
      className={`relative isolate flex rounded-xl overflow-hidden ${imageShell} ${wrapAlign} ${glowStage}`}
    >
      <img
        src={assetUrl(img)}
        alt=""
        className={`relative z-[1] pointer-events-none select-none [image-rendering:auto] ${imgTreat}`}
        draggable={false}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </motion.div>
  );

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: mobileLayout ? 1.02 : 1.012 }}
      whileTap={{ scale: mobileLayout ? 0.985 : 0.992 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      data-home-accent={accent}
      className={`group relative z-[1] inicio-home-card touch-manipulation rounded-2xl border outline-none lg:rounded-xl lg:p-2.5 lg:pt-3 xl:p-3 xl:pt-3.5 ${
        mobileCarousel
          ? `inicio-home-card--mobile-carousel h-full min-h-0 w-full max-w-full overflow-hidden rounded-xl border p-2 sm:p-2.5 ${CARD_BOX}`
          : mobileScroll
            ? `inicio-home-card--mobile-stack h-full min-h-0 w-full max-w-full overflow-hidden rounded-xl border p-2 sm:p-2.5 ${CARD_BOX}`
            : `overflow-hidden active:scale-[0.98] ${CARD_BOX} p-2.5 sm:p-3`
      } ${styles.restShadow} ${cardChrome} ${styles.frame}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-[0.52] ${styles.innerSheen}`}
      />
      <motion.div className="inicio-home-card__body relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden px-0.5 pt-1 sm:pt-1.5 lg:pt-2">
        {imageArea}
      </motion.div>
      <p
        className={`inicio-home-card__caption relative z-[1] shrink-0 text-center font-space font-semibold leading-snug tracking-[0.03em] text-white/95 ${
          mobileLayout
            ? 'mt-0 px-2 py-1.5 text-[clamp(0.625rem,2.35vw,0.75rem)] leading-snug sm:px-2.5 sm:py-1.5'
            : 'mt-1.5 px-1.5 text-[clamp(0.6875rem,2.6vw,0.8125rem)] sm:mt-2 sm:text-xs md:text-[0.8125rem] lg:mt-1 lg:px-1.5 lg:text-[0.6875rem] lg:leading-tight xl:text-xs'
        }`}
      >
        {caption}
      </p>
    </motion.button>
  );
}
