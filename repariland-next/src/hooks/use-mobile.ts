import * as React from 'react';

/** Breakpoint app móvil/desktop (alineado con globals.css lg) */
export const APP_MOBILE_BREAKPOINT = 1024;

function readIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < APP_MOBILE_BREAKPOINT;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(readIsMobile);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${APP_MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(mql.matches);
    };
    mql.addEventListener('change', onChange);
    onChange();
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

/** `undefined` hasta hidratar (evita flash modal incorrecto en SSR). */
export function useIsAppMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${APP_MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < APP_MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    onChange();
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
