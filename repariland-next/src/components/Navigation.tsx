import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MobileTabBar from './MobileTabBar';
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
}[] = [
  {
    screen: 'inicio',
    label: 'INICIO',
    gradient: 'from-[#6ADB7A] via-[#32C965] to-[#1BA851]',
  },
  {
    screen: 'historia',
    label: 'HISTORIA',
    gradient: 'from-[#FFF56D] via-[#FFE135] to-[#F5C400]',
  },
  {
    screen: 'servicios',
    label: 'SERVICIOS',
    gradient: 'from-[#FF5A5A] via-[#EE2E38] to-[#D41E28]',
  },
  {
    screen: 'noticias',
    label: 'NOTICIAS',
    gradient: 'from-[#FF9A4A] via-[#FF7528] to-[#E85F12]',
  },
  {
    screen: 'contacto',
    label: 'CONTACTO',
    gradient: 'from-[#FF7BC4] via-[#FF4AAD] to-[#E31D8F]',
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
      data-dock-action={dir === 'left' ? 'prev' : 'next'}
      onPointerDown={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className={`group relative z-[20] flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.04] text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-colors hover:border-white/18 hover:bg-white/[0.08] hover:text-white active:bg-white/[0.06] touch-manipulation pointer-events-auto ${className}`}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_20px_-4px_rgba(56,189,248,0.45)]"
        aria-hidden
      />
      {dir === 'left' ? (
        <ChevronLeft className="relative z-[1] h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
      ) : (
        <ChevronRight className="relative z-[1] h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
      )}
    </motion.button>
  );
}

function DesktopDockNav({
  currentScreen,
  onNavigate,
  onPrev,
  onNext,
}: NavigationProps) {
  return (
    <nav
      className="relative z-[20] hidden w-full shrink-0 touch-manipulation pointer-events-auto lg:block"
      aria-label="Navegación principal"
    >
      <div className="pointer-events-none h-px shrink-0 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-90" />

      <div className="dock-nav-rail border-b border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="mx-auto flex h-full w-full max-w-[min(100%,28rem)] items-center justify-center gap-1 px-2 sm:max-w-[min(100%,32rem)]">
          <ChevronControl dir="left" onClick={onPrev} label="Pantalla anterior" />

          <div
            role="tablist"
            aria-label="Secciones"
            className="grid h-full min-w-0 flex-1 grid-cols-5 items-center gap-0"
          >
            {navItems.map((item) => {
              const isActive = currentScreen === item.screen;
              const dotBase = 'dock-nav-dot ring-1 transition-[box-shadow,opacity] duration-200';
              const dotActive = `${dotBase} ring-white/50 opacity-100 shadow-[0_0_14px_-2px_currentColor]`;
              const dotIdle = `${dotBase} ring-white/15 opacity-[0.84] hover:opacity-100`;

              return (
                <button
                  key={item.screen}
                  type="button"
                  role="tab"
                  data-dock-action={`nav-${item.screen}`}
                  aria-selected={isActive}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onNavigate(item.screen);
                  }}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative z-[20] flex h-full min-w-0 w-full cursor-pointer flex-col items-center justify-center gap-1 pointer-events-auto [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 active:opacity-90"
                >
                  <span
                    className={`pointer-events-none relative rounded-full bg-gradient-to-br hover:brightness-105 ${item.gradient} ${isActive ? dotActive : dotIdle}`}
                  >
                    <span
                      className="pointer-events-none absolute inset-[1.5px] rounded-full bg-black/10 mix-blend-multiply backdrop-blur-[1px]"
                      aria-hidden
                    />
                  </span>

                  <span
                    className={`pointer-events-none line-clamp-2 w-full max-w-[3.5rem] text-center font-space text-[9px] font-medium uppercase leading-[1.05] tracking-[0.08em] ${
                      isActive ? 'text-white' : 'text-white/58'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <ChevronControl dir="right" onClick={onNext} label="Pantalla siguiente" />
        </div>
      </div>
    </nav>
  );
}

export default function Navigation({ currentScreen, onNavigate, onPrev, onNext }: NavigationProps) {
  return (
    <>
      <MobileTabBar currentScreen={currentScreen} onNavigate={onNavigate} />
      <DesktopDockNav
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}
