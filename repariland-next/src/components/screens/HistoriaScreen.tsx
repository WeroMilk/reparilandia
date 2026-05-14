import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { assetUrl } from '@/lib/assetUrl';

const milestones = [
  { year: '1985', text: 'Don Jaime abre el taller con una caja de herramientas y un sueño.' },
  { year: '2000', text: 'Carlos se une al negocio familiar, trayendo visión creativa.' },
  { year: '2010', text: 'El taller evoluciona: coleccionismo y museo.' },
  { year: '2026', text: 'Dos generaciones, una pasión por reparar el pasado.' },
];

const storyC =
  'Monito C — el alma del equipo. Le encantan los retos “imposibles” y cargar con los proyectos más pesados. Si algo está chueco, él lo endereza con paciencia y buen humor.';

const storyA =
  'Monito A — nuestro personaje principal. Conoce cada rincón del taller: desde consolas retro hasta la pieza más rara del museo. Para él, reparar es preservar historias.';

const storyB =
  'Monito B — el detalle fino. Entre diagnósticos y mantenimiento personalizado, pone el ojo clínico en cada equipo. Si hay que explicar el “por qué”, él lo cuenta con calma.';

const storyAccents = {
  c: 'border-violet-400/25 from-violet-950/25 shadow-[0_0_28px_-12px_rgba(167,139,250,0.2)]',
  a: 'border-cyan-400/25 from-cyan-950/20 shadow-[0_0_28px_-12px_rgba(34,211,238,0.18)]',
  b: 'border-amber-300/25 from-amber-950/15 shadow-[0_0_28px_-12px_rgba(251,191,36,0.15)]',
} as const;

function StoryPanel({
  monitoSrc,
  monitoAlt,
  imgClassName,
  text,
  delay,
  accent,
}: {
  monitoSrc: string;
  monitoAlt: string;
  imgClassName: string;
  text: string;
  delay: number;
  accent: keyof typeof storyAccents;
}) {
  const ac = storyAccents[accent];
  return (
    <motion.div
      className={`group relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-gradient-to-b to-black/35 p-3.5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-sm sm:p-4.5 ${ac}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.65, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.07] to-transparent" aria-hidden />
      <div className="relative z-10 flex shrink-0 justify-center px-0.5 pt-1.5 pb-0 sm:pt-2">
        <img
          src={assetUrl(monitoSrc)}
          alt={monitoAlt}
          className={`pointer-events-none w-auto object-contain object-top select-none drop-shadow-[0_16px_40px_rgba(0,0,0,0.52)] transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] [transform:translateZ(0)] ${imgClassName}`}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
      <p className="relative z-0 mt-2.5 min-h-0 flex-1 overflow-hidden font-space text-[11px] leading-relaxed text-white/90 sm:mt-3 sm:text-sm md:text-[0.9375rem] md:leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}

export default function HistoriaScreen() {
  return (
    <div className="screen-shell flex min-h-0 flex-1 flex-col overflow-hidden">
      <motion.div
        className="shrink-0 text-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-orbitron text-xl tracking-[0.35em] text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.12)] sm:text-2xl md:text-3xl">
          HISTORIA
        </h2>
        <div className="mx-auto mt-1.5 h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent sm:w-32" />
      </motion.div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden pb-1 sm:mt-3 sm:gap-3 lg:mt-4 lg:flex-row lg:items-stretch lg:gap-4">
        <motion.div
          className="relative flex min-h-0 shrink-0 flex-col overflow-hidden rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-950/50 via-slate-950/40 to-black/50 p-3.5 shadow-[0_0_32px_-14px_rgba(34,211,238,0.2)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-md sm:p-4.5 lg:min-w-0 lg:max-w-[32%] lg:flex-[1.12] xl:flex-[1.02]"
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        >
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="relative shrink-0">
              <div className="rounded-2xl bg-gradient-to-b from-cyan-400/12 via-white/[0.05] to-transparent p-1.5 ring-1 ring-cyan-300/30 shadow-[0_18px_48px_-12px_rgba(34,211,238,0.4)]">
                <img
                  src={assetUrl('/assets/historia-et.png')}
                  alt="E.T. — ícono de la historia de Reparilandia"
                  className="h-[min(42vw,11rem)] w-auto max-w-[8.5rem] object-contain object-bottom [transform:translateZ(0)] sm:h-[min(36vw,12.5rem)] sm:max-w-[9.5rem] md:h-[min(32vw,13.5rem)] md:max-w-[10rem]"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-3 flex items-center gap-2 font-orbitron text-xs tracking-[0.18em] text-amber-100/95 sm:text-sm">
                <Star className="h-4 w-4 shrink-0 text-amber-300/90" />
                LÍNEA DEL TIEMPO
              </h3>
              <div className="flex max-h-[min(42dvh,22rem)] flex-col gap-2.5 overflow-hidden sm:max-h-none lg:max-h-[min(56dvh,32rem)]">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3">
                    <span className="w-11 shrink-0 pt-0.5 text-right font-orbitron text-xs font-semibold text-cyan-200 sm:w-12 sm:text-sm">
                      {m.year}
                    </span>
                    <p className="min-w-0 flex-1 border-l border-cyan-400/30 pl-2.5 font-space text-[11px] leading-snug text-white/92 sm:pl-3 sm:text-sm md:text-[0.9375rem] md:leading-snug">
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden sm:gap-3 lg:flex-row lg:gap-3.5">
          <StoryPanel
            accent="c"
            monitoSrc="/assets/historia-monito-c.png"
            monitoAlt="Monito C"
            imgClassName="max-h-[min(64vw,14.5rem)] max-w-[min(92%,13.5rem)] sm:max-h-[16.75rem] sm:max-w-[14rem] md:max-h-[18rem] md:max-w-[14.5rem]"
            text={storyC}
            delay={0.06}
          />
          <StoryPanel
            accent="a"
            monitoSrc="/assets/historia-monito-a.png"
            monitoAlt="Monito A"
            imgClassName="max-h-[min(62vw,14rem)] max-w-[min(94%,13.75rem)] sm:max-h-[16.25rem] sm:max-w-[14.25rem] md:max-h-[17.5rem] md:max-w-[14.75rem]"
            text={storyA}
            delay={0.1}
          />
          <StoryPanel
            accent="b"
            monitoSrc="/assets/historia-monito-b.png"
            monitoAlt="Monito B"
            imgClassName="max-h-[min(64vw,14.5rem)] max-w-[min(90%,13.25rem)] sm:max-h-[16.75rem] sm:max-w-[13.75rem] md:max-h-[18rem] md:max-w-[14.25rem]"
            text={storyB}
            delay={0.14}
          />
        </div>
      </div>
    </div>
  );
}
