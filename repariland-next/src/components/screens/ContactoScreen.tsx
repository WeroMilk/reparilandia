import { motion } from 'framer-motion';
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

  const innerSection = 'rounded-xl border border-white/[0.1] bg-[#0f0f16] p-1.5 sm:p-2';

  const MONITO_SOMBRERO = '/assets/contacto-monito-izq.png';
  const MONITO_PADRE_HIJO = '/assets/contacto-padre-hijo.png';

  const socialBtn =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition-colors hover:border-cyan-400/35 hover:bg-white/[0.1] hover:text-cyan-100 touch-manipulation sm:h-10 sm:w-10';

  return (
    <motion.div className="screen-shell flex min-h-0 flex-1 flex-col overflow-x-hidden !pt-[clamp(1.75rem,4.5dvh,3.25rem)] lg:!pt-[clamp(2rem,5dvh,3.5rem)]">
      <motion.div className="shrink-0 text-center" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text font-orbitron text-xl tracking-wide text-transparent sm:text-2xl md:text-3xl">
          Contacto
        </h2>
        <p className="mt-1 font-space text-[10px] text-white/60 sm:text-[11px]">
          Correo, WhatsApp o mensaje directo.
        </p>
      </motion.div>

      <div className="flex min-h-0 flex-1 flex-col pb-3 sm:pb-4 lg:pb-5">
        <div className="mx-auto mt-0 grid min-h-0 w-full max-w-[min(96vw,40rem)] flex-1 grid-cols-1 content-start gap-x-4 gap-y-4 pt-1 pb-4 sm:max-w-[min(96vw,52rem)] sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4 sm:pb-5 md:max-w-[min(56rem,96vw)] lg:mt-2 lg:max-w-[min(90rem,98vw)] lg:grid-cols-2 lg:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-x-6 lg:gap-y-0 lg:pb-6 xl:max-w-[min(92rem,98vw)] xl:gap-x-8">
          {/* Izquierda: contacto + redes encima a la derecha del monito; caricatura más arriba y desplazada a la derecha */}
          <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col justify-self-stretch">
            <img
              src={assetUrl(MONITO_SOMBRERO)}
              alt=""
              className="pointer-events-none absolute -left-6 top-[-3.35rem] z-[8] h-[clamp(8.75rem,28vw,12.5rem)] w-auto max-w-[min(88vw,12rem)] translate-x-3 select-none object-contain object-left-bottom drop-shadow-[0_14px_28px_rgba(0,0,0,0.5)] sm:-left-7 sm:top-[-3.6rem] sm:h-[clamp(9.25rem,26vw,13rem)] sm:max-w-[min(82vw,12.75rem)] sm:translate-x-4 lg:-left-[2.85rem] lg:top-[-3.85rem] lg:h-[clamp(9.5rem,22vw,13.25rem)] lg:max-w-[13rem] lg:translate-x-5 [image-rendering:auto]"
              draggable={false}
              loading="eager"
              decoding="async"
            />
            <motion.div
              className={`relative z-[24] ${panelOpaque} mt-[clamp(3.35rem,11vw,4.75rem)] flex max-h-[min(72vh,44rem)] min-h-0 flex-1 flex-col overflow-hidden p-1.5 sm:p-2 lg:mt-[clamp(3.1rem,7vw,4rem)] lg:max-h-[min(78vh,46rem)] xl:max-h-[min(80vh,48rem)]`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="pointer-events-none absolute bottom-0 left-0 z-[1] h-12 w-[45%] rounded-[100%] bg-black/35 blur-xl" aria-hidden />

              <div className="relative z-[2] flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-1.5 py-1.5 scrollbar-hide sm:gap-2 sm:p-2">
                <div className="flex flex-wrap items-start gap-x-2 gap-y-2 border-b border-white/[0.07] pb-2 sm:pb-2.5">
                  <div className="min-h-[2.5rem] min-w-[min(32%,7.5rem)] shrink-0 sm:min-w-[8.25rem]" aria-hidden />
                  <div className="ml-auto flex min-w-0 flex-col items-end gap-2">
                    <span className="font-space text-[9px] uppercase tracking-[0.22em] text-white/50 sm:text-[10px]">
                      Síguenos
                    </span>
                    <div className="flex flex-wrap justify-end gap-2 sm:gap-2.5">
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
                  <div className="mb-2 flex items-center gap-2 font-orbitron text-[11px] tracking-[0.16em] text-cyan-100/95 sm:text-xs">
                    <Mail className="h-4 w-4 shrink-0 text-hologram-cyan sm:h-[1.125rem] sm:w-[1.125rem]" />
                    CORREO
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="break-all font-space text-xs leading-snug text-sky-200/95 underline-offset-2 hover:underline sm:text-[0.8125rem]"
                  >
                    {email}
                  </a>
                  <div className="mt-3 flex items-center gap-2 border-t border-white/[0.08] pt-3 font-orbitron text-[11px] tracking-[0.1em] text-white/85 sm:text-xs">
                    <Phone className="h-4 w-4 shrink-0 text-hologram-gold sm:h-[1.125rem] sm:w-[1.125rem]" />
                    <span className="font-space tracking-normal">{telefono}</span>
                  </div>
                </section>

                <section className={innerSection}>
                  <div className="mb-2 flex items-center gap-2 font-orbitron text-[11px] tracking-[0.16em] text-amber-100/95 sm:text-xs">
                    <MapPin className="h-4 w-4 shrink-0 text-amber-200/90 sm:h-[1.125rem] sm:w-[1.125rem]" />
                    DIRECCIÓN
                  </div>
                  <p className="whitespace-pre-line font-space text-xs leading-relaxed text-white/88 sm:text-[0.8125rem]">
                    {workshopAddress}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-500/15 px-3 py-2.5 font-space text-xs font-semibold text-sky-100/95 shadow-[0_0_20px_-8px_rgba(56,189,248,0.35)] transition-colors hover:border-sky-400/45 hover:bg-sky-500/22 touch-manipulation sm:text-sm"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                    Abrir en Google Maps
                  </a>
                </section>

                <section className={innerSection}>
                  <div className="mb-2 flex items-center gap-2 font-orbitron text-[11px] tracking-[0.16em] text-emerald-100/95 sm:text-xs">
                    <Clock className="h-4 w-4 shrink-0 text-emerald-300/90 sm:h-[1.125rem] sm:w-[1.125rem]" />
                    HORARIO
                  </div>
                  <p className="font-space text-xs leading-relaxed text-white/88 sm:text-[0.8125rem]">
                    Lun–vie: 8:30–12:50 y 14:30–18:50
                    <br />
                    Sáb: 9:00–13:00
                    <br />
                    Dom: cerrado
                  </p>
                </section>

                <motion.button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-400/25 bg-gradient-to-r from-emerald-500/25 to-teal-600/20 px-3 py-3 text-sm font-semibold tracking-wide text-emerald-50 shadow-[0_0_24px_-6px_rgba(52,211,153,0.35)] transition-colors active:from-emerald-500/35 touch-manipulation sm:text-[0.9375rem]"
                  whileTap={{ scale: 0.99 }}
                >
                  <MessageCircle className="h-5 w-5 shrink-0 sm:h-[1.35rem] sm:w-[1.35rem]" />
                  WHATSAPP
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Derecha: formulario compacto; caricatura encima del contenido (sin capturar clics) */}
          <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col justify-self-stretch sm:mt-0">
            <motion.div
              className={`relative z-[12] ${panelOpaque} flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl p-1.5 sm:p-2`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img
                src={assetUrl(MONITO_PADRE_HIJO)}
                alt=""
                className="pointer-events-none absolute bottom-0 right-0 z-[110] h-auto max-h-[min(46vh,22rem)] w-[min(92%,20rem)] max-w-[calc(100%-0.5rem)] select-none object-contain [object-position:right_bottom] [image-rendering:auto] mix-blend-screen brightness-[1.14] contrast-[1.1] saturate-[1.06] drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)] sm:max-h-[min(48vh,23.5rem)] sm:w-[min(90%,21.5rem)] lg:max-h-[min(50vh,25rem)] lg:w-[min(88%,22.5rem)] xl:max-h-[min(52vh,26.5rem)] xl:w-[min(86%,24rem)]"
                draggable={false}
                loading="eager"
                decoding="async"
              />

              <div className="relative z-[20] flex min-h-0 flex-1 flex-col overflow-hidden px-1.5 pb-1.5 pt-1 sm:p-2 sm:pb-2">
                <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                  <p className="mb-2 font-orbitron text-[11px] tracking-[0.14em] text-cyan-100/85 sm:text-xs">MENSAJE</p>
                  <ContactForm embedded />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
