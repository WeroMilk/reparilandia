'use client';

import { useMemo, type CSSProperties } from 'react';

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

const STAR_COUNT = 680;

/**
 * Campo de estrellas blancas. El fondo queda transparente: solo los puntos.
 * En horizontal se reparte a lo ancho y en vertical a lo alto, porque las
 * posiciones van en porcentaje del escenario.
 */
export default function NoticiasStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => {
        const roll = seeded(i, 4);
        const size =
          roll > 0.97
            ? 2.6 + seeded(i, 8) * 1.1
            : roll > 0.88
              ? 1.7 + seeded(i, 8) * 0.55
              : roll > 0.55
                ? 1.15 + seeded(i, 8) * 0.3
                : 1;
        const bright = roll > 0.88;
        return {
          key: i,
          left: `${seeded(i, 1) * 100}%`,
          top: `${seeded(i, 2) * 100}%`,
          size,
          glow: bright,
          opacityLow: bright ? 0.18 + seeded(i, 5) * 0.12 : 0.22 + seeded(i, 5) * 0.22,
          opacityHigh: bright ? 0.9 + seeded(i, 9) * 0.1 : 0.55 + seeded(i, 9) * 0.35,
          duration: 1.7 + seeded(i, 6) * 4.8,
          delay: seeded(i, 7) * 6.5,
        };
      }),
    [],
  );

  return (
    <div className="noticias-stars" aria-hidden>
      {stars.map((star) => (
        <span
          key={star.key}
          className="noticias-star particle-twinkle"
          style={
            {
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              boxShadow: star.glow ? '0 0 4px rgba(255,255,255,0.9)' : undefined,
              '--p-lo': star.opacityLow,
              '--p-hi': star.opacityHigh,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
