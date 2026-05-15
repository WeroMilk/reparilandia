import Navigation from './Navigation';
import FooterLegal from './FooterLegal';
import type { ScreenName } from '@/types';

interface AppDockProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function AppDock({ currentScreen, onNavigate, onPrev, onNext }: AppDockProps) {
  return (
    <div className="dock-chrome pointer-events-auto relative z-[1] flex w-full max-w-[1440px] touch-manipulation flex-col overflow-hidden border-t border-white/[0.07] bg-[#0c0c10]/96 shadow-dock backdrop-blur-xl supports-[backdrop-filter]:bg-[#0c0c10]/80 safe-pbDock lg:mb-3 lg:rounded-2xl lg:border lg:border-white/[0.08] lg:px-2">
      <Navigation
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        onPrev={onPrev}
        onNext={onNext}
      />
      <FooterLegal />
    </div>
  );
}
