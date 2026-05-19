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
    <div className="dock-chrome pointer-events-auto relative z-[1] mx-auto flex w-full max-w-[min(100%,56rem)] touch-manipulation flex-col overflow-hidden border-t border-white/[0.08] bg-[var(--chrome-surface)] shadow-dock backdrop-blur-2xl supports-[backdrop-filter]:bg-black/60 safe-pbDock lg:mb-[max(0.75rem,env(safe-area-inset-bottom,0px))] lg:rounded-2xl lg:border lg:px-2 app-canvas">
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
