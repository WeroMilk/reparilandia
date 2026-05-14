import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Monitor, Gamepad2, ToyBrick, Stethoscope, MoreHorizontal, Wrench, Calendar } from 'lucide-react';
import QuoteForm from '@/components/forms/QuoteForm';
import AppointmentForm from '@/components/forms/AppointmentForm';
import type { Service } from '@/types';
import { assetUrl } from '@/lib/assetUrl';

const services: Service[] = [
  {
    id: 'laptops',
    icon: 'laptop',
    title: 'LAPTOPS',
    description: 'Hardware, pantalla, teclado, batería, limpieza y optimización.',
  },
  {
    id: 'pc-escritorio',
    icon: 'monitor',
    title: 'PC ESCRITORIO',
    description: 'Mantenimiento, ensamblaje, upgrades y refrigeración.',
  },
  {
    id: 'consolas',
    icon: 'gamepad',
    title: 'CONSOLAS',
    description: 'De Atari a PS5: lector óptico, HDMI, sobrecalentamiento y consolas con fallo de sistema.',
  },
  {
    id: 'juguetes',
    icon: 'toy',
    title: 'JUGUETES',
    description: 'Electrónicos, robótica, trenes y piezas con historia.',
  },
  {
    id: 'diagnostico',
    icon: 'stethoscope',
    title: 'DIAGNÓSTICO',
    description: 'Evaluación profesional y presupuesto sin compromiso.',
  },
  {
    id: 'otros',
    icon: 'more',
    title: 'OTROS',
    description: 'Cámaras, audio, proyectores y tecnología retro.',
  },
];

const iconMap: Record<string, React.ElementType> = {
  laptop: Laptop,
  monitor: Monitor,
  gamepad: Gamepad2,
  toy: ToyBrick,
  stethoscope: Stethoscope,
  more: MoreHorizontal,
};

function ServiceIOSCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full min-w-0 flex-1 rounded-[1rem] border border-white/[0.14] bg-gradient-to-b from-white/[0.11] to-white/[0.04] shadow-[0_10px_40px_-16px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-xl backdrop-saturate-150 transition-[border-color,background-color,box-shadow,transform] duration-200 hover:border-white/[0.2] hover:from-white/[0.13] hover:shadow-[0_14px_44px_-14px_rgba(0,0,0,0.78)] active:scale-[0.99]"
      style={{ WebkitBackdropFilter: 'blur(24px) saturate(180%)' }}
    >
      {children}
    </div>
  );
}

const DEFAULT_HERO =
  (process.env.NEXT_PUBLIC_SERVICIOS_HERO_IMAGE as string | undefined)?.trim() ||
  '/assets/hero-reparamos-carritos.png';

function StarWarsHeroFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-90" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-black" />
      <div className="absolute bottom-[12%] left-1/2 h-[28%] w-[42%] -translate-x-1/2 rounded-lg border border-white/10 bg-zinc-800/80 shadow-inner">
        <ToyBrick className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 text-amber-300/90" strokeWidth={1.25} />
      </div>
      {/* Siluetas tipo casco — referencia lúdica a “la galaxia” */}
      <svg className="absolute bottom-[8%] left-[8%] h-[55%] w-[22%] text-zinc-300/55" viewBox="0 0 60 100" fill="currentColor">
        <ellipse cx="30" cy="28" rx="22" ry="26" />
        <rect x="14" y="50" width="32" height="40" rx="6" />
      </svg>
      <svg className="absolute bottom-[8%] right-[8%] h-[55%] w-[22%] text-zinc-400/55" viewBox="0 0 60 100" fill="currentColor">
        <ellipse cx="30" cy="28" rx="22" ry="26" />
        <rect x="14" y="50" width="32" height="40" rx="6" />
      </svg>
    </div>
  );
}

function ServiciosHeroBanner() {
  const heroSrc = DEFAULT_HERO;
  const [heroFailed, setHeroFailed] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-[inherit]">
      <div className="relative isolate w-full min-h-[11rem] sm:min-h-[13rem] md:min-h-[15rem]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_92%_115%_at_50%_38%,rgba(34,211,238,0.12)_0%,rgba(15,23,42,0.65)_42%,rgba(2,6,23,0.94)_72%,rgba(0,0,0,0.97)_100%)]"
          aria-hidden
        />
        {heroFailed ? (
          <div className="relative min-h-[11rem] w-full sm:min-h-[13rem] md:min-h-[15rem]">
            <StarWarsHeroFallback />
          </div>
        ) : (
          <img
            src={assetUrl(heroSrc)}
            alt="Equipo Reparilandia reparando carritos montables"
            className="relative z-[1] mx-auto h-auto w-full max-w-[min(100%,44rem)] object-contain object-center px-3 pt-4 pb-1 [image-rendering:auto] drop-shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:px-6 sm:pt-5 sm:pb-2 md:max-h-[min(54vh,21rem)]"
            draggable={false}
            onError={() => setHeroFailed(true)}
          />
        )}
      </div>
      <div className="relative z-[2] border-t border-cyan-400/15 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-3 py-2.5 text-center sm:py-3.5">
        <p className="font-orbitron text-xs font-bold uppercase tracking-[0.2em] text-cyan-50 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] sm:text-sm md:text-[0.9375rem]">
          Reparamos carritos montables
        </p>
        {process.env.NODE_ENV === 'development' && heroFailed && (
          <p className="mt-1.5 font-space text-[9px] text-amber-200/85 sm:text-[10px]">
            Coloca hero en public/assets/hero-reparamos-carritos.png o NEXT_PUBLIC_SERVICIOS_HERO_IMAGE.
          </p>
        )}
      </div>
    </div>
  );
}

export default function ServiciosScreen() {
  const [quoteService, setQuoteService] = useState<string | null>(null);
  const [showAppointment, setShowAppointment] = useState(false);

  return (
    <div className="screen-shell flex min-h-0 flex-1 flex-col overflow-hidden">
      <motion.div className="shrink-0 text-center" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-orbitron text-lg tracking-[0.28em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.08)] sm:text-xl md:text-2xl">
          SERVICIOS
        </h2>
        <p className="mx-auto mt-1 max-w-lg px-2 font-space text-[10px] text-white/72 sm:text-[11px]">
          Toca un servicio para pedir cotización. Reserva cita o tour con el botón dorado.
        </p>
      </motion.div>

      <motion.div
        className="mt-2 flex shrink-0 justify-center sm:mt-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.06 }}
      >
        <motion.button
          type="button"
          onClick={() => setShowAppointment(true)}
          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-amber-400/45 bg-amber-500/12 px-3 py-1.5 text-[9px] font-semibold tracking-wide text-amber-100 shadow-[0_0_16px_rgba(255,215,0,0.08)] transition-colors active:bg-amber-500/20 touch-manipulation sm:text-[10px]"
          whileTap={{ scale: 0.98 }}
        >
          <Calendar className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          PROGRAMAR CITA / TOUR
        </motion.button>
      </motion.div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden pb-1 sm:mt-3 sm:gap-3">
        <motion.div
          className="relative mx-auto w-full max-w-4xl shrink-0 overflow-hidden rounded-2xl border border-cyan-400/20 bg-black/35 shadow-[0_0_40px_-12px_rgba(34,211,238,0.18)] ring-1 ring-inset ring-white/[0.06]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <ServiciosHeroBanner />
        </motion.div>

        <div className="grid min-h-0 flex-1 grid-flow-col grid-rows-3 grid-cols-2 content-start gap-2.5 sm:gap-3 lg:flex lg:min-h-0 lg:flex-row-reverse lg:flex-wrap lg:items-stretch lg:justify-center lg:gap-3 lg:overflow-y-auto xl:gap-3.5">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Wrench;
            return (
              <ServiceIOSCard key={service.id}>
                <motion.div
                  role="button"
                  tabIndex={0}
                  className="flex h-full min-h-[7.5rem] cursor-pointer touch-manipulation flex-col items-center gap-2 px-2.5 py-2.5 text-center sm:min-h-[8.25rem] sm:gap-2 sm:px-3 sm:py-3.5 lg:min-h-0 lg:w-[calc(33.333%-0.75rem)] lg:min-w-[10.5rem] lg:max-w-[13rem] lg:flex-none xl:w-[calc(16.666%-0.65rem)] xl:min-w-[8.5rem] xl:max-w-none"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + i * 0.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setQuoteService(service.title)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setQuoteService(service.title);
                    }
                  }}
                >
                  <div className="flex flex-col items-center gap-2 sm:gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.08] sm:h-10 sm:w-10">
                      <Icon className="h-[1.05rem] w-[1.05rem] text-sky-300 sm:h-5 sm:w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="w-full break-words px-0.5 text-center font-orbitron text-[10px] font-semibold leading-snug tracking-wide text-white/95 sm:text-[11px] md:text-xs">
                      {service.title}
                    </h3>
                  </div>
                  <p className="flex-1 text-balance text-center font-space text-[9px] leading-snug text-white/80 sm:text-[10px] sm:leading-relaxed md:text-[11px] md:leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex w-full shrink-0 items-center justify-center gap-1 border-t border-white/[0.08] pt-2 sm:pt-2.5">
                    <Wrench className="h-3 w-3 shrink-0 text-sky-300/90 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
                    <span className="font-space text-[9px] font-semibold tracking-wide text-sky-300/95 sm:text-[10px]">
                      Cotizar
                    </span>
                  </div>
                </motion.div>
              </ServiceIOSCard>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {quoteService && (
          <motion.div
            className="fixed inset-0 z-[10070] flex items-center justify-center p-3 sm:p-4 md:p-6 safe-pt native-scroll overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuoteService(null)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
            <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <QuoteForm serviceName={quoteService} onClose={() => setQuoteService(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAppointment && (
          <motion.div
            className="fixed inset-0 z-[10070] flex items-center justify-center p-2 sm:p-3 safe-pt native-scroll overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAppointment(false)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
            <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <AppointmentForm onClose={() => setShowAppointment(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
