import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ScreenName } from '@/types';

interface NavigationProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  onPrev: () => void;
  onNext: () => void;
}

const navItems: {
  screen: ScreenName;
  label: string;
  gradient: string;
  shadowActive: string;
}[] = [
  {
    screen: 'inicio',
    label: 'Inicio',
    gradient: 'from-[#6ADB7A] via-[#32C965] to-[#1BA851]',
    shadowActive: 'shadow-[0_0_14px_-3px_rgba(40,200,90,0.45)]',
  },
  {
    screen: 'historia',
    label: 'Historia',
    gradient: 'from-[#FFF56D] via-[#FFE135] to-[#F5C400]',
    shadowActive: 'shadow-[0_0_14px_-3px_rgba(245,200,20,0.4)]',
  },
  {
    screen: 'servicios',
    label: 'Servicios',
    gradient: 'from-[#FF5A5A] via-[#EE2E38] to-[#D41E28]',
    shadowActive: 'shadow-[0_0_14px_-3px_rgba(238,45,55,0.42)]',
  },
  {
    screen: 'noticias',
    label: 'Noticias',
    gradient: 'from-[#FF9A4A] via-[#FF7528] to-[#E85F12]',
    shadowActive: 'shadow-[0_0_14px_-3px_rgba(255,115,40,0.4)]',
  },
  {
    screen: 'contacto',
    label: 'Contacto',
    gradient: 'from-[#FF7BC4] via-[#FF4AAD] to-[#E31D8F]',
    shadowActive: 'shadow-[0_0_14px_-3px_rgba(255,80,170,0.4)]',
  },
];

function ChevronControl({
  dir,
  onClick,
  label,
  className = '',
}: {
  dir: 'left' | 'right';
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.04] text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-colors hover:border-white/18 hover:bg-white/[0.08] hover:text-white active:bg-white/[0.06] touch-manipulation lg:h-8 lg:w-8 ${className}`}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
    >
      <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_20px_-4px_rgba(56,189,248,0.45)]" />
      {dir === 'left' ? (
        <ChevronLeft className="relative z-[1] h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
      ) : (
        <ChevronRight className="relative z-[1] h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
      )}
    </motion.button>
  );
}

export default function Navigation({ currentScreen, onNavigate, onPrev, onNext }: NavigationProps) {
  return (
    <nav className="relative z-40 w-full shrink-0" aria-label="Navegación principal">
      <div className="h-px bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-90" />

      <div className="border-b border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-1 px-2 py-2.5 min-[400px]:gap-2 min-[400px]:px-2.5 lg:py-2.5">
          <ChevronControl
            dir="left"
            onClick={onPrev}
            label="Pantalla anterior"
            className="max-[380px]:h-8 max-[380px]:w-8"
          />

          <div className="flex min-w-0 flex-1 items-end justify-evenly gap-1 px-0.5 min-[420px]:gap-1.5 sm:justify-center sm:gap-2.5 md:gap-3">
            {navItems.map((item) => {
              const isActive = currentScreen === item.screen;
              return (
                <motion.button
                  key={item.screen}
                  type="button"
                  onClick={() => onNavigate(item.screen)}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className="group relative flex flex-col items-center justify-end touch-manipulation"
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: isActive ? 1.04 : 1.03 }}
                  animate={{
                    scale: isActive ? 1.06 : 1,
                    y: 0,
                  }}
                  transition={{ type: 'spring', stiffness: 440, damping: 38 }}
                >
                  {/* punto activo */}
                  {isActive && (
                    <motion.span
                      layoutId="navActiveGlow"
                      className={`absolute -inset-x-2 -bottom-1 -top-0.5 -z-[1] rounded-xl bg-gradient-to-br ${item.gradient} opacity-[0.12] blur-sm`}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      aria-hidden
                    />
                  )}

                  <span
                    className={`relative block rounded-full bg-gradient-to-br shadow-md ${
                      isActive ? `ring-2 ring-white/45 ${item.shadowActive}` : 'ring-[0.5px] ring-white/12 opacity-[0.78] hover:opacity-100'
                    } ${item.gradient} transition-opacity duration-300 hover:brightness-105`}
                    style={{
                      width: isActive ? 'clamp(1.6rem, 4.2vw, 1.95rem)' : 'clamp(1.14rem, 3.05vw, 1.38rem)',
                      height: isActive ? 'clamp(1.6rem, 4.2vw, 1.95rem)' : 'clamp(1.14rem, 3.05vw, 1.38rem)',
                      boxShadow: isActive ? undefined : 'inset 0 1px 4px rgba(255,255,255,0.12)',
                    }}
                  >
                    <span className="absolute inset-[1.5px] rounded-full bg-black/10 mix-blend-multiply backdrop-blur-[1px]" aria-hidden />
                  </span>

                  <span
                    className={`mt-1 max-h-[2.5rem] truncate text-center font-space text-[8px] font-medium uppercase tracking-[0.14em] sm:text-[9px] md:text-[10px] ${
                      isActive ? 'text-white' : 'text-white/55 group-hover:text-white/80'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <ChevronControl
            dir="right"
            onClick={onNext}
            label="Pantalla siguiente"
            className="max-[380px]:h-8 max-[380px]:w-8"
          />
        </div>
      </div>
    </nav>
  );
}
