import type { ElementType } from 'react';
import { Home, BookOpen, Wrench, Newspaper, MessageCircle } from 'lucide-react';
import type { ScreenName } from '@/types';

export const mobileNavItems: {
  screen: ScreenName;
  label: string;
  Icon: ElementType;
  activeClass: string;
  idleClass: string;
}[] = [
  {
    screen: 'inicio',
    label: 'Inicio',
    Icon: Home,
    activeClass: 'text-[#6ADB7A]',
    idleClass: 'text-white/55',
  },
  {
    screen: 'historia',
    label: 'Historia',
    Icon: BookOpen,
    activeClass: 'text-[#FFE135]',
    idleClass: 'text-white/55',
  },
  {
    screen: 'servicios',
    label: 'Servicios',
    Icon: Wrench,
    activeClass: 'text-[#FF5A5A]',
    idleClass: 'text-white/55',
  },
  {
    screen: 'noticias',
    label: 'Noticias',
    Icon: Newspaper,
    activeClass: 'text-[#FF9A4A]',
    idleClass: 'text-white/55',
  },
  {
    screen: 'contacto',
    label: 'Cotizar',
    Icon: MessageCircle,
    activeClass: 'text-[#FF7BC4]',
    idleClass: 'text-white/55',
  },
];

interface MobileTabBarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export default function MobileTabBar({ currentScreen, onNavigate }: MobileTabBarProps) {
  return (
    <nav
      className="dock-nav-rail relative z-[20] w-full shrink-0 touch-manipulation pointer-events-auto lg:hidden"
      aria-label="Navegación principal"
    >
      <div
        role="tablist"
        aria-label="Secciones"
        className="mx-auto grid h-full min-h-[4rem] w-full max-w-[100vw] grid-cols-5 items-stretch px-1"
      >
        {mobileNavItems.map(({ screen, label, Icon, activeClass, idleClass }) => {
          const isActive = currentScreen === screen;
          return (
            <button
              key={screen}
              type="button"
              role="tab"
              data-dock-action={`nav-${screen}`}
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              onPointerDown={(e) => {
                e.stopPropagation();
                onNavigate(screen);
              }}
              className="mobile-tab-hit relative z-[20] flex min-h-[4rem] w-full cursor-pointer flex-col items-center justify-center gap-0.5 px-0.5 [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-400/70"
            >
              <Icon
                className={`h-7 w-7 shrink-0 ${isActive ? activeClass : idleClass}`}
                strokeWidth={isActive ? 2.25 : 1.75}
                aria-hidden
              />
              <span
                className={`pointer-events-none line-clamp-1 w-full text-center font-space text-[9px] font-medium uppercase leading-tight tracking-[0.06em] sm:text-[10px] ${
                  isActive ? 'text-white' : 'text-white/58'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
