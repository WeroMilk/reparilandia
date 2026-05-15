'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type ScreenPageTitleProps = {
  children: ReactNode;
  /** Línea decorativa bajo el título (p. ej. Historia). */
  showRule?: boolean;
  animate?: boolean;
};

export default function ScreenPageTitle({
  children,
  showRule = false,
  animate = true,
}: ScreenPageTitleProps) {
  const Header = animate ? motion.header : 'header';
  const motionProps = animate
    ? { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 } }
    : {};

  return (
    <>
      <Header className="screen-page-header" {...motionProps}>
        <h2 className="screen-page-title">{children}</h2>
      </Header>
      {showRule ? <div className="screen-page-title-rule" aria-hidden /> : null}
    </>
  );
}
