'use client';

import type { ReactNode } from 'react';
import ScreenPageTitle from '@/components/ScreenPageTitle';

type MobileScreenLayoutProps = {
  title: ReactNode;
  lead?: ReactNode;
  showRule?: boolean;
  hideLeadOnMobile?: boolean;
  /** Decoración absoluta (p. ej. monito) que puede superponerse al header en desktop */
  headerOverlay?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Shell de pantalla: título arriba, contenido en el centro (flex), dock global abajo.
 */
export default function MobileScreenLayout({
  title,
  lead,
  showRule = false,
  hideLeadOnMobile = false,
  headerOverlay,
  children,
  className = '',
}: MobileScreenLayoutProps) {
  const leadClass = hideLeadOnMobile
    ? 'screen-page-lead max-lg:screen-page-lead--mobile-hidden'
    : 'screen-page-lead';

  return (
    <div className={`screen-shell mobile-screen relative flex min-h-0 flex-1 flex-col overflow-hidden ${className}`}>
      {headerOverlay != null ? (
        <div className="mobile-screen__overlay pointer-events-none absolute inset-x-0 top-0 z-[18] hidden overflow-visible lg:block">
          {headerOverlay}
        </div>
      ) : null}
      <div className="mobile-screen__header relative z-[20] shrink-0">
        <ScreenPageTitle showRule={showRule}>{title}</ScreenPageTitle>
        {lead != null ? <p className={leadClass}>{lead}</p> : null}
      </div>
      <div className="mobile-screen__body">{children}</div>
    </div>
  );
}
