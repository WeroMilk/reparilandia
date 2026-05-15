import { motion } from 'framer-motion';
import ScreenPageTitle from '@/components/ScreenPageTitle';
import {
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';
import { assetUrl } from '@/lib/assetUrl';

const DEFAULT_WORKSHOP_ADDRESS = 'Hermosillo, Sonora, México';

export default function ContactoScreen() {
  const handleWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '520000000000';
    const message =
      '¡Hola, Reparilandia! Me gustaría recibir más información sobre sus servicios.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const email = 'hola@reparilandia.com';
  const telefono = '+52 (000) 000-0000';

  const workshopAddress =
    process.env.NEXT_PUBLIC_WORKSHOP_ADDRESS?.trim() || DEFAULT_WORKSHOP_ADDRESS;
  const googleMapsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL?.trim() ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(workshopAddress)}`;

  const panelOpaque =
    'flex w-full flex-col overflow-visible rounded-2xl border border-white/[0.14] bg-[#14141c] shadow-[0_22px_56px_-26px_rgba(0,0,0,0.88),0_0_30px_-14px_rgba(56,189,248,0.13)] ring-1 ring-white/[0.09]';

  const innerSection = 'rounded-lg border border-white/[0.1] bg-[#0f0f16] p-1 sm:p-1';

  const MONITO_SOMBRERO = '/assets/contacto-monito-izq.png';

  const socialBtn =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition-colors hover:border-cyan-400/35 hover:bg-white/[0.1] hover:text-cyan-100 touch-manipulation sm:h-9 sm:w-9';

  return (
    <motion.div className="screen-shell flex min-h-0 flex-1 flex-col !overflow-visible">
      <ScreenPageTitle>CONTACTO</ScreenPageTitle>
      <p className="screen-page-lead text-white/60">
        Correo, WhatsApp o mensaje directo.
      </p>

      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-x-clip overflow-y-visible pb-1 pt-2 sm:overflow-x-visible sm:pb-2 sm:pt-2 lg:pt-3">
        <div className="mx-auto grid w-full min-w-0 max-w-full shrink-0 grid-cols-1 items-start justify-items-stretch gap-x-2.5 gap-y-2 px-1 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-3 sm:px-0 md:max-w-full lg:gap-x-4 xl:gap-x-5">
          {/* Izquierda: datos de contacto; caricatura detrás del panel, asomada por arriba */}
          <div className="relative flex w-full min-w-0 flex-col overflow-visible sm:max-w-none">
            <img
              src={assetUrl(MONITO_SOMBRERO)}
              alt=""
              className="pointer-events-none absolute -left-3 top-[-9.15rem] z-[18] mb-4 h-[clamp(12rem,34vw,17.5rem)] w-auto max-w-[min(92vw,16.25rem)] -translate-x-0.5 select-none object-contain object-left-bottom drop-shadow-[0_14px_28px_rgba(0,0,0,0.5)] sm:-left-5 sm:top-[-9.5rem] sm:mb-5 sm:h-[clamp(13rem,30vw,18.5rem)] sm:max-w-[min(88vw,17rem)] sm:-translate-x-1 lg:top-[-9.75rem] lg:mb-6 lg:h-[clamp(13.5rem,24vw,19rem)] lg:max-w-[17.5rem] lg:-translate-x-1 xl:top-[-9.9rem] xl:mb-7 [image-rendering:auto]"
              draggable={false}
              loading="eager"
              decoding="async"
            />
            <motion.div
              className={`relative z-[24] ${panelOpaque} mt-[clamp(3rem,9vw,4.1rem)] flex w-full flex-col overflow-visible rounded-2xl p-1 sm:p-1.5 lg:mt-[clamp(2.85rem,6vw,3.65rem)]`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="pointer-events-none absolute bottom-0 left-0 z-[1] h-10 w-[45%] rounded-[100%] bg-black/35 blur-lg" aria-hidden />

              <div className="relative z-[2] flex flex-col gap-0.5 overflow-visible px-1 py-0.5 sm:gap-1 sm:px-1.5 sm:py-1">
                <div className="flex flex-wrap items-start gap-x-1.5 gap-y-1 border-b border-white/[0.07] pb-1 sm:pb-1.5">
                  <div className="min-h-[2rem] min-w-[min(32%,6.5rem)] shrink-0 sm:min-w-[7rem]" aria-hidden />
                  <div className="ml-auto flex min-w-0 flex-col items-end gap-1 sm:gap-1.5">
                    <span className="font-space text-[8px] uppercase tracking-[0.2em] text-white/50 sm:text-[9px]">
                      Síguenos
                    </span>
                    <div className="flex flex-wrap justify-end gap-1 sm:gap-1.5">
                      <a href="#" aria-label="Facebook" className={socialBtn}>
                        <Facebook className="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem]" />
                      </a>
                      <a href="#" aria-label="Instagram" className={socialBtn}>
                        <Instagram className="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem]" />
                      </a>
                      <a href="#" aria-label="YouTube" className={socialBtn}>
                        <Youtube className="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem]" />
                      </a>
                      <a href={`mailto:${email}`} aria-label="Correo" className={socialBtn}>
                        <Mail className="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem]" />
                      </a>
                      <a href={`tel:${telefono.replace(/[^\d+]/g, '')}`} aria-label="Teléfono" className={socialBtn}>
                        <Phone className="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem]" />
                      </a>
                    </div>
                  </div>
                </div>

                <section className={innerSection}>
                  <div className="mb-0.5 flex items-center gap-1 font-orbitron text-[9px] tracking-[0.14em] text-cyan-100/95 sm:mb-0.5 sm:gap-1.5 sm:text-[10px] md:text-[11px]">
                    <Mail className="h-3 w-3 shrink-0 text-hologram-cyan sm:h-3.5 sm:w-3.5" />
                    CORREO
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="break-all font-space text-[10px] leading-snug text-sky-200/95 underline-offset-2 hover:underline sm:text-[11px] md:text-xs"
                  >
                    {email}
                  </a>
                  <div className="mt-1.5 flex items-center gap-1.5 border-t border-white/[0.08] pt-1.5 font-orbitron text-[9px] tracking-[0.08em] text-white/85 sm:text-[10px] md:text-[11px]">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-hologram-gold sm:h-4 sm:w-4" />
                    <span className="font-space tracking-normal">{telefono}</span>
                  </div>
                </section>

                <section className={innerSection}>
                  <div className="mb-0.5 flex items-center gap-1 font-orbitron text-[9px] tracking-[0.14em] text-amber-100/95 sm:gap-1.5 sm:text-[10px] md:text-[11px]">
                    <MapPin className="h-3 w-3 shrink-0 text-amber-200/90 sm:h-3.5 sm:w-3.5" />
                    DIRECCIÓN
                  </div>
                  <p className="font-space text-[10px] leading-snug text-white/88 sm:text-[11px] md:text-xs">
                    {workshopAddress}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex min-h-[34px] w-full items-center justify-center gap-1 rounded-md border border-sky-400/30 bg-sky-500/15 px-2 py-1.5 font-space text-[10px] font-semibold text-sky-100/95 shadow-[0_0_16px_-8px_rgba(56,189,248,0.35)] transition-colors hover:border-sky-400/45 hover:bg-sky-500/22 touch-manipulation sm:mt-1.5 sm:min-h-[36px] sm:text-[11px]"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                    Abrir en Google Maps
                  </a>
                </section>

                <section className={innerSection}>
                  <div className="mb-0.5 flex items-center gap-1 font-orbitron text-[9px] tracking-[0.14em] text-emerald-100/95 sm:gap-1.5 sm:text-[10px] md:text-[11px]">
                    <Clock className="h-3 w-3 shrink-0 text-emerald-300/90 sm:h-3.5 sm:w-3.5" />
                    HORARIO
                  </div>
                  <p className="font-space text-[9px] leading-snug text-white/88 sm:text-[10px] md:text-[11px]">
                    Lun–vie 8:30–12:50, 14:30–18:50 · Sáb 9–13 · Dom cierre
                  </p>
                </section>

                <motion.button
                  type="button"
                  onClick={handleWhatsApp}
                  className="mt-1 flex min-h-[38px] w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-emerald-400/25 bg-gradient-to-r from-emerald-500/25 to-teal-600/20 px-2 py-1.5 text-[11px] font-semibold tracking-wide text-emerald-50 shadow-[0_0_20px_-6px_rgba(52,211,153,0.35)] transition-colors active:from-emerald-500/35 touch-manipulation sm:mt-1.5 sm:min-h-[40px] sm:px-2.5 sm:py-2 sm:text-xs"
                  whileTap={{ scale: 0.99 }}
                >
                  <MessageCircle className="h-4 w-4 shrink-0 sm:h-[1.125rem] sm:w-[1.125rem]" />
                  WHATSAPP
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Derecha: formulario */}
          <div className="relative flex w-full min-w-0 flex-col overflow-visible sm:max-w-none">
            <motion.div
              className={`relative z-[12] ${panelOpaque} flex w-full flex-col overflow-visible rounded-2xl p-1 sm:p-1.5`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative z-[20] flex flex-col overflow-visible px-1 pb-1 pt-0.5 sm:px-1.5 sm:pb-1.5 sm:pt-1">
                <p className="mb-0.5 shrink-0 font-orbitron text-[9px] tracking-[0.12em] text-cyan-100/85 sm:mb-0.5 sm:text-[10px] md:text-[11px]">
                  MENSAJE
                </p>
                <ContactForm embedded />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
