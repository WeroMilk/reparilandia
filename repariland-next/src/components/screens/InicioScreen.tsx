import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { ScreenName } from '@/types';
import { assetUrl } from '@/lib/assetUrl';

const logoImgClass =
  'object-contain object-center [-webkit-font-smoothing:antialiased] [image-rendering:auto] drop-shadow-[0_4px_40px_rgba(0,0,0,0.55)] [transform:translateZ(0)] [backface-visibility:hidden]';

interface InicioScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const boxVariants = {
  a: {
    accent: 'ring-cyan-400/40 hover:border-cyan-400/25',
    bar: 'from-cyan-400/90 to-cyan-700/35',
    label: 'text-cyan-50/95',
  },
  b: {
    accent: 'ring-amber-300/35 hover:border-amber-300/22',
    bar: 'from-amber-300/85 to-orange-700/35',
    label: 'text-amber-50/95',
  },
  c: {
    accent: 'ring-fuchsia-400/35 hover:border-fuchsia-400/22',
    bar: 'from-fuchsia-400/85 to-purple-900/35',
    label: 'text-fuchsia-50/95',
  },
} as const;

const cardTransition = { type: 'spring' as const, stiffness: 420, damping: 32 };

function HomeActionBox({
  title,
  onClick,
  children,
  className = '',
  variant,
  index,
}: {
  title: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  variant: keyof typeof boxVariants;
  index: number;
}) {
  const v = boxVariants[variant];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...cardTransition, delay: index * 0.05 }}
      whileHover={{ y: -3, transition: cardTransition }}
      whileTap={{ scale: 0.985 }}
      className={`group relative flex min-h-0 w-full min-w-0 flex-1 touch-manipulation flex-col overflow-hidden rounded-xl border border-white/[0.1] bg-gradient-to-b from-white/[0.09] to-slate-950/55 p-2 text-left shadow-[0_10px_32px_-18px_rgba(0,0,0,0.72)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-md transition-colors duration-200 hover:border-white/18 sm:rounded-[1.25rem] sm:p-2.5 ${v.accent} ${className}`}
      style={{ WebkitBackdropFilter: 'blur(16px) saturate(140%)' }}
    >
      <div className={`pointer-events-none absolute left-2.5 right-2.5 top-0 h-px rounded-full bg-gradient-to-r ${v.bar}`} aria-hidden />
      {children}
      <span
        className={`relative z-10 mt-auto border-t border-white/[0.07] px-1 pt-2 text-center font-space text-xs font-semibold uppercase leading-tight tracking-[0.07em] sm:text-sm md:text-[0.95rem] lg:text-base ${v.label}`}
      >
        {title}
      </span>
    </motion.button>
  );
}

export default function InicioScreen({ onNavigate }: InicioScreenProps) {
  return (
    <div className="screen-shell relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mx-auto flex w-full min-h-0 max-w-6xl flex-1 flex-col justify-start gap-2 px-3 pt-0 pb-1 sm:gap-2.5 sm:px-5 sm:pt-0.5 lg:gap-3">
        <header className="-mt-1 flex w-full shrink-0 flex-col items-center justify-center text-center sm:-mt-2">
          <div className="flex w-full justify-center px-1 sm:px-2">
            <motion.img
              src={assetUrl('/assets/logo-reparilandia.png')}
              alt="Reparilandia"
              className={`${logoImgClass} mx-auto block h-auto w-auto max-h-[min(34dvh,280px)] max-w-[min(92vw,820px)] object-contain object-center sm:max-h-[min(38dvh,310px)] sm:max-w-[min(90vw,900px)]`}
              loading="eager"
              decoding="async"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              draggable={false}
            />
          </div>
          <p className="mt-0.5 max-w-md font-space text-xs font-medium leading-snug tracking-[0.14em] text-white/80 sm:mt-1 sm:text-sm md:text-base">
            &ldquo;La capital de la reparación&rdquo;
          </p>
        </header>

        <div className="mx-auto -mt-0.5 grid min-h-0 w-full max-w-5xl flex-1 grid-cols-1 gap-2 sm:-mt-1 sm:grid-cols-1 sm:gap-2.5 lg:grid-cols-3 lg:items-stretch lg:gap-3">
          <HomeActionBox
            variant="a"
            index={0}
            title="Reparamos Carritos Montables"
            onClick={() => onNavigate('servicios')}
          >
            <div className="relative z-10 flex min-h-[10rem] flex-1 items-center justify-center overflow-visible px-1 py-3 sm:min-h-[11rem] md:min-h-[12.5rem]">
              <img
                src={assetUrl('/assets/home-box-carritos.png')}
                alt=""
                className="pointer-events-none max-h-[min(52vw,15.5rem)] w-auto max-w-[min(96%,22rem)] object-contain object-center select-none drop-shadow-[0_18px_44px_rgba(0,0,0,0.52)] transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:drop-shadow-[0_24px_55px_rgba(56,189,248,0.22)] sm:max-h-[min(44vw,17.5rem)] sm:max-w-[24rem] md:max-h-[18.5rem]"
                draggable={false}
              />
            </div>
          </HomeActionBox>

          <HomeActionBox
            variant="b"
            index={1}
            title="Servicio y Mantenimiento personalizado"
            onClick={() => onNavigate('servicios')}
          >
            <div className="relative z-10 flex min-h-[10rem] flex-1 items-center justify-center overflow-visible px-2 py-3 sm:min-h-[11rem] md:min-h-[12.5rem]">
              <img
                src={assetUrl('/assets/home-box-servicio.png')}
                alt=""
                className="pointer-events-none max-h-[min(58vw,17.5rem)] w-auto max-w-[min(90%,13.5rem)] translate-y-7 object-contain object-center select-none drop-shadow-[0_18px_44px_rgba(0,0,0,0.52)] transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:drop-shadow-[0_24px_55px_rgba(251,191,36,0.2)] sm:max-h-[min(50vw,19rem)] sm:max-w-[15rem] sm:translate-y-9 md:max-h-[20rem] md:max-w-[15.5rem] md:translate-y-10"
                draggable={false}
              />
            </div>
          </HomeActionBox>

          <HomeActionBox
            variant="c"
            index={2}
            title="Esperen novedades, próximamente…"
            onClick={() => onNavigate('noticias')}
          >
            <div className="relative z-10 flex min-h-[10rem] w-full flex-1 items-center justify-center overflow-visible px-2 py-3 sm:min-h-[11rem] md:min-h-[12.5rem]">
              <img
                src={assetUrl('/assets/home-box-novedades.png')}
                alt=""
                className="pointer-events-none mx-auto h-auto w-full max-h-[min(46vw,16.5rem)] max-w-[min(96%,23rem)] translate-y-6 object-contain object-center select-none drop-shadow-[0_18px_44px_rgba(0,0,0,0.52)] transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035] group-hover:drop-shadow-[0_24px_55px_rgba(244,114,182,0.22)] sm:max-h-[min(40vw,18rem)] sm:max-w-[24rem] sm:translate-y-8 md:max-h-[19.25rem] md:translate-y-9"
                draggable={false}
              />
            </div>
          </HomeActionBox>
        </div>
      </div>

      <h1 className="sr-only">Reparilandia — &ldquo;La capital de la reparación&rdquo;</h1>
    </div>
  );
}
