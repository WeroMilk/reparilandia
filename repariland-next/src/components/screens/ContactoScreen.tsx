import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';
import { assetUrl } from '@/lib/assetUrl';

export default function ContactoScreen() {
  const handleWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '520000000000';
    const message = 'Hola Reparilandia! Me gustaría obtener más información sobre sus servicios.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const contactInfo = [
    { icon: MapPin, label: 'UBICACIÓN', value: 'Hermosillo, Sonora, México', color: 'text-hologram-cyan' },
    { icon: Phone, label: 'TELÉFONO', value: '+52 (000) 000-0000', color: 'text-hologram-gold' },
    { icon: Mail, label: 'EMAIL', value: 'hola@reparilandia.com', color: 'text-hologram-cyan' },
    {
      icon: Clock,
      label: 'HORARIO',
      value: 'Lun–vie 8:30–12:50, 14:30–18:50 · Sáb 9–13 · Dom cerrado',
      color: 'text-green-400',
    },
  ];

  const panelClass =
    'relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-gradient-to-b from-white/[0.08] to-slate-950/50 p-3 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-md sm:p-4';

  return (
    <div className="screen-shell flex min-h-0 flex-1 flex-col overflow-hidden">
      <motion.div
        className="shrink-0 text-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text font-orbitron text-xl tracking-wide text-transparent sm:text-2xl md:text-3xl">
          Contacto
        </h2>
        <p className="mt-1 font-space text-[10px] text-white/60 sm:text-[11px]">
          Los monitos sostienen la info — escríbenos cuando quieras.
        </p>
      </motion.div>

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden pb-1 sm:mt-3 sm:gap-4 lg:grid-cols-2 lg:items-stretch">
        <motion.div className={panelClass} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <div
            className="pointer-events-none absolute -bottom-4 left-0 z-[5] h-16 w-[55%] rounded-[100%] bg-black/50 blur-xl"
            aria-hidden
          />
          <img
            src={assetUrl('/assets/contacto-monito-izq.png')}
            alt=""
            className="pointer-events-none absolute -left-1 bottom-0 z-10 h-[min(42vw,10.25rem)] w-auto max-w-[min(54%,12.5rem)] object-contain object-left object-bottom select-none drop-shadow-[0_20px_42px_rgba(0,0,0,0.68)] sm:-left-0.5 sm:h-[min(36vw,11.5rem)] sm:max-w-[min(50%,13.5rem)] lg:left-0 lg:h-[min(11.5rem,17vw)] lg:max-w-[14.5rem]"
            draggable={false}
          />
          <h3 className="relative z-0 mb-2 text-center font-orbitron text-[10px] tracking-[0.2em] text-cyan-100/95 sm:text-xs">
            Datos del taller
          </h3>
          <div className="relative z-0 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden pl-[min(30vw,6.5rem)] sm:pl-[min(26vw,7rem)] lg:pl-[min(8.5rem,14vw)]">
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex min-w-0 items-start gap-2 rounded-xl border border-white/[0.1] bg-black/30 p-2 shadow-inner sm:gap-2.5 sm:p-2.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/12 sm:h-9 sm:w-9">
                    <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${item.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 font-orbitron text-[9px] font-medium tracking-wider text-white/92 sm:text-[10px]">
                      {item.label}
                    </div>
                    <div className="font-space text-[9px] leading-snug text-white/90 sm:text-[10px] md:text-[11px]">
                      {item.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div className={panelClass} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
          <div
            className="pointer-events-none absolute -bottom-4 right-0 z-[5] h-20 w-[60%] rounded-[100%] bg-black/55 blur-2xl"
            aria-hidden
          />
          <img
            src={assetUrl('/assets/contacto-monito-der.png')}
            alt=""
            className="pointer-events-none absolute -right-1 bottom-0 z-10 h-[min(52vw,12.5rem)] w-auto max-w-[min(62%,17rem)] object-contain object-right object-bottom select-none drop-shadow-[0_22px_48px_rgba(0,0,0,0.65)] sm:-right-0.5 sm:h-[min(44vw,14rem)] sm:max-w-[min(56%,18rem)] lg:right-0 lg:h-[min(15rem,24vw)] lg:max-w-[19rem]"
            draggable={false}
          />
          <h3 className="relative z-0 mb-2 pr-[min(30vw,6.5rem)] text-center font-orbitron text-[10px] tracking-[0.2em] text-cyan-100/95 sm:pr-[min(26vw,7.25rem)] sm:text-xs lg:pr-[min(11rem,17vw)]">
            Mensaje directo
          </h3>
          <motion.button
            type="button"
            onClick={handleWhatsApp}
            className="relative z-0 mb-2 flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-400/25 bg-gradient-to-r from-emerald-500/25 to-teal-600/20 px-3 py-2 text-xs font-semibold tracking-wide text-emerald-50 shadow-[0_0_24px_-6px_rgba(52,211,153,0.35)] transition-colors active:from-emerald-500/35 active:to-teal-600/28 touch-manipulation sm:text-sm"
            whileTap={{ scale: 0.99 }}
          >
            <MessageCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            WHATSAPP
          </motion.button>
          <div className="relative z-0 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-[min(28vw,5.75rem)] scrollbar-hide sm:pr-[min(24vw,6.5rem)] lg:pr-[min(10rem,17vw)]">
            <ContactForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
