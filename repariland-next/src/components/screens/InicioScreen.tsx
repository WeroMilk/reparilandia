import { motion } from 'framer-motion';
import Image from 'next/image';
import type { ScreenName } from '@/types';
import { assetUrl } from '@/lib/assetUrl';

const LOGO = '/assets/logo-reparilandia.png';

const IMG_CARRITOS = '/assets/home-box-carritos.png';
const IMG_SERVICIO = '/assets/home-box-servicio.png';
const IMG_NOVEDADES = '/assets/home-box-novedades.png';

const CARD_BOX =
  'flex h-full min-h-[15rem] w-full flex-col lg:h-[19rem] lg:min-h-[19rem] lg:max-h-[19rem]';

interface InicioScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export default function InicioScreen({ onNavigate }: InicioScreenProps) {
  return (
    <motion.div
      className="relative flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden px-2 pb-0 pt-0 sm:px-4 lg:mx-auto lg:px-6 xl:px-8"
    >
      <motion.div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-10 flex w-full shrink-0 flex-col items-center px-1 text-center sm:px-2">
          <motion.div
            className="mt-[clamp(0.5rem,2vh,1.5rem)] flex w-full translate-y-0 flex-col items-center gap-0 bg-transparent leading-none sm:mt-[clamp(0.65rem,2.5vh,1.75rem)] sm:translate-y-1 md:translate-y-2"
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
              sizes="(max-width: 640px) min(94vw, 28rem), (max-width: 1024px) min(90vw, 32rem), min(86vw, 36rem)"
              className="mx-auto block h-auto w-full max-w-[min(94vw,28rem)] bg-transparent object-contain object-center [image-rendering:auto] drop-shadow-[0_14px_48px_rgba(0,0,0,0.45)] sm:max-w-[min(90vw,32rem)] md:max-w-[min(86vw,36rem)]"
              draggable={false}
            />
            <p className="-mt-16 max-w-xl px-3 font-orbitron text-sm font-medium leading-none tracking-[0.2em] text-cyan-100/92 drop-shadow-[0_0_20px_rgba(34,211,238,0.22)] sm:-mt-[4.75rem] sm:text-base sm:tracking-[0.24em] md:-mt-24 md:text-lg lg:-mt-28">
              La capital de la reparación
            </p>
          </motion.div>
        </header>

        <motion.div
          className="relative z-[1] mx-auto mt-[clamp(2.35rem,6.2vh,3.5rem)] mb-2 grid w-full max-w-6xl shrink-0 grid-cols-1 gap-3 sm:mt-11 sm:gap-4 md:mt-14 lg:grid-cols-3 lg:items-stretch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <HomeSpotlightCard
            img={IMG_CARRITOS}
            caption="Reparamos Carritos Montables (niños)"
            onClick={() => onNavigate('servicios')}
            accent="green"
          />
          <HomeSpotlightCard
            img={IMG_SERVICIO}
            caption="Servicio y Mantenimiento 100% Personalizado."
            onClick={() => onNavigate('servicios')}
            accent="amber"
            centerProminent
          />
          <HomeSpotlightCard
            img={IMG_NOVEDADES}
            caption="Espera novedades. Próximamente…"
            onClick={() => onNavigate('noticias')}
            accent="red"
          />
        </motion.div>

        <motion.div className="min-h-0 shrink-0 basis-0 pointer-events-none" aria-hidden />
      </motion.div>

      <h1 className="sr-only">Reparilandia</h1>
    </motion.div>
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
      'max-h-[106%] max-w-[96%] origin-center scale-[1.14] translate-y-2 object-contain object-center sm:scale-[1.12] sm:translate-y-3 md:scale-[1.1] md:translate-y-3.5';
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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.992 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      className={`group relative z-[1] ${CARD_BOX} touch-manipulation overflow-hidden rounded-2xl border p-3 outline-none sm:p-4 ${styles.restShadow} ${cardChrome} ${styles.frame}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-[0.52] ${styles.innerSheen}`}
      />
      <motion.div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden px-0.5 pt-0.5">
        {imageArea}
      </motion.div>
      <p className="relative z-[1] mt-2 shrink-0 min-h-[2.75rem] px-0.5 text-center font-space text-[11px] font-semibold leading-snug tracking-[0.04em] text-white/92 sm:mt-2.5 sm:min-h-[3rem] sm:text-xs md:text-[0.8125rem]">
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
