'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import CarouselDots from '@/components/CarouselDots';
import MobileScreenLayout from '@/components/MobileScreenLayout';
import GuaranteePromise from '@/components/GuaranteePromise';
import type { ScreenName } from '@/types';
import { assetUrl } from '@/lib/assetUrl';

const LOGO = '/assets/logo-reparilandia.png';

const IMG_CARRITOS = '/assets/home-box-carritos.png';
const IMG_SERVICIO = '/assets/home-box-servicio.png';
const IMG_NOVEDADES = '/assets/home-box-novedades.png';

const CARD_BOX =
  'flex h-full min-h-0 w-full max-h-full flex-col lg:min-h-0 lg:max-h-[min(36cqh,32dvh)]';

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

interface InicioScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export default function InicioScreen({ onNavigate }: InicioScreenProps) {
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

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <MobileScreenLayout title="INICIO" className="inicio-screen">
      <motion.div className="inicio-mobile-stage relative flex min-h-0 flex-1 flex-col overflow-hidden max-lg:overflow-hidden lg:overflow-visible lg:justify-start lg:gap-1 lg:pb-6 xl:gap-1.5 xl:pb-8">
        <motion.div
          className="inicio-mobile-hero inicio-desktop-hero relative z-10 flex w-full shrink-0 flex-col items-center gap-1 px-1 text-center max-lg:gap-1 sm:px-2 lg:-mt-5 lg:max-h-none lg:gap-0 lg:pt-0 xl:-mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={assetUrl(LOGO)}
            alt="Reparilandia"
            width={1024}
            height={682}
            priority
            quality={100}
            placeholder="empty"
            sizes="(max-width: 1023px) min(94vw, 38rem), min(88vw, 58rem)"
            className="mx-auto block h-auto w-full max-h-[min(26dvh,14.5rem)] max-w-[min(94vw,36rem)] bg-transparent object-contain object-center [image-rendering:auto] drop-shadow-[0_14px_48px_rgba(0,0,0,0.45)] sm:max-h-[min(28dvh,15.5rem)] sm:max-w-[min(94vw,38rem)] md:max-h-[min(29dvh,16.25rem)] md:max-w-[min(92vw,40rem)] lg:max-h-[min(30dvh,18.5rem)] lg:max-w-[min(88vw,48rem)] xl:max-h-[min(32dvh,20rem)] xl:max-w-[min(86vw,52rem)]"
            draggable={false}
          />
          <motion.div className="inicio-mobile-trust inicio-desktop-trust flex w-full flex-col items-center gap-1.5 max-lg:gap-1 lg:gap-1.5">
            <p className="max-w-xl px-3 font-orbitron text-[clamp(0.6875rem,2.8vw,0.875rem)] font-medium leading-none tracking-[0.14em] text-cyan-100/95 drop-shadow-[0_0_20px_rgba(34,211,238,0.22)] sm:text-sm sm:tracking-[0.22em] lg:-mt-12 lg:mb-0.5 lg:text-base lg:tracking-[0.24em] xl:-mt-14 xl:mb-0.5 xl:text-lg xl:tracking-[0.26em]">
              La capital de la reparación
            </p>
            <GuaranteePromise variant="compact" className="w-full max-w-md sm:max-w-lg lg:hidden" />
            <GuaranteePromise className="hidden w-full lg:mt-1 lg:mb-0.5 lg:block xl:mb-1" />
          </motion.div>
        </motion.div>

        {/* Móvil: un slide a pantalla completa, sin peek horizontal */}
        <motion.div
          className="inicio-mobile-boxes flex min-h-0 flex-1 flex-col overflow-hidden lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div className="inicio-mobile-center-block flex w-full min-h-0 max-h-full flex-col items-center justify-center gap-1">
          <motion.div className="inicio-mobile-carousel">
            <motion.div ref={emblaRef} className="inicio-mobile-embla min-h-0 overflow-hidden">
              <motion.div className="flex h-full touch-pan-x">
              {homeCards.map((card) => (
                <motion.div
                  key={card.img}
                  className="flex h-full min-h-0 min-w-0 shrink-0 grow-0 basis-full justify-center px-4 sm:px-5"
                >
                  <div className="flex h-full min-h-0 w-full max-w-[min(86vw,20.5rem)] flex-col">
                    <HomeSpotlightCard
                      img={card.img}
                      caption={card.caption}
                      onClick={() => onNavigate(card.screen)}
                      accent={card.accent}
                      centerProminent={card.centerProminent}
                    />
                  </div>
                </motion.div>
              ))}
              </motion.div>
            </motion.div>
            <CarouselDots count={homeCards.length} active={slideIndex} onSelect={scrollTo} className="inicio-mobile-dots shrink-0 pt-1" />
          </motion.div>
          </motion.div>
        </motion.div>
        {/* Escritorio: tres columnas, más arriba y separadas del dock */}
        <motion.div
          className="inicio-desktop-boxes relative z-[1] mx-auto hidden min-h-0 w-full max-w-6xl flex-1 grid-cols-3 items-stretch justify-items-stretch gap-2.5 overflow-visible px-0 pb-0 pt-0 lg:grid lg:max-h-[min(36cqh,32dvh)] lg:self-start lg:translate-y-1.5 xl:max-w-[68rem] xl:gap-3 xl:translate-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {homeCards.map((card) => (
            <motion.div key={card.img} className="flex min-h-0 h-full flex-col pt-1 lg:pt-0.5">
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
}: {
  img: string;
  caption: string;
  onClick: () => void;
  accent: HomeBoxAccent;
  centerProminent?: boolean;
  cropLegs?: boolean;
}) {
  const styles = HOME_BOX_ACCENT[accent];

  let imgTreat =
    'max-h-full max-w-[92%] object-contain object-center origin-center';

  if (centerProminent) {
    imgTreat =
      'max-h-[106%] max-w-[96%] origin-center scale-[1.05] translate-y-2 object-contain object-center sm:scale-[1.04] sm:translate-y-2 md:scale-[1.03] md:translate-y-2.5';
  }

  const wrapAlign = centerProminent
    ? 'items-center justify-center pt-2'
    : 'items-center justify-center py-1';

  const cardChrome =
    'bg-black ring-1 ring-inset transition-[border-color,box-shadow,ring-color] duration-200';

  const glowStage = `home-box-glow home-box-glow--${accent}${
    centerProminent ? ' home-box-glow--center' : ''
  }`;

  const imageArea = cropLegs ? (
    <motion.div
      className={`relative mx-auto min-h-0 w-full flex-1 overflow-hidden rounded-lg ${glowStage}`}
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
      className={`relative isolate flex min-h-0 flex-1 overflow-hidden rounded-xl ${wrapAlign} ${glowStage}`}
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
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.992 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      className={`group relative z-[1] ${CARD_BOX} touch-manipulation overflow-hidden rounded-2xl border p-2.5 outline-none active:scale-[0.98] sm:p-3 lg:overflow-visible lg:rounded-xl lg:p-2.5 lg:pt-3 xl:p-3 xl:pt-3.5 ${styles.restShadow} ${cardChrome} ${styles.frame}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-[0.52] ${styles.innerSheen}`}
      />
      <motion.div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden px-0.5 pt-1 sm:pt-1.5 lg:pt-2">
        {imageArea}
      </motion.div>
      <p className="relative z-[1] mt-1.5 shrink-0 px-1.5 text-center font-space text-[clamp(0.6875rem,2.6vw,0.8125rem)] font-semibold leading-snug tracking-[0.03em] text-white/95 sm:mt-2 sm:text-xs md:text-[0.8125rem] lg:mt-1 lg:text-[0.6875rem] lg:leading-tight xl:text-xs">
        {caption}
      </p>
    </motion.button>
  );
}

type HomeBoxAccent = 'green' | 'amber' | 'red';

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
