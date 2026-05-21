'use client';

import { useState } from 'react';
import { useContactoMobileFit } from '@/hooks/useContactoMobileFit';
import { useContactoMobileZone } from '@/hooks/useContactoMobileZone';
import ContactForm, { CONTACT_FORM_ID } from '@/components/forms/ContactForm';
import { AnimatePresence, motion } from 'framer-motion';
import { MOTION_IOS_SPRING, PANEL_SWAP_TRANSITION, panelSwapVariants } from '@/lib/motionPresets';
import MobileScreenLayout from '@/components/MobileScreenLayout';
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
  Send,
  ChevronLeft,
} from 'lucide-react';
import { assetUrl } from '@/lib/assetUrl';

const DEFAULT_WORKSHOP_ADDRESS = 'Av Veracruz 49, Centro, 83000 Hermosillo, Son.';
const DEFAULT_GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/AaU1CLhgiY1eiZSH6';

function getWorkshopLocation() {
  const workshopAddress =
    process.env.NEXT_PUBLIC_WORKSHOP_ADDRESS?.trim() || DEFAULT_WORKSHOP_ADDRESS;
  const googleMapsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL?.trim() || DEFAULT_GOOGLE_MAPS_URL;
  return { workshopAddress, googleMapsUrl };
}

const CONTACT = {
  email: 'reparilandia@hotmail.com',
  telefonoDisplay: '(662) 355-5470',
  telefonoTel: '+526623555470',
  telefono2Display: '6622 38 36 56',
  telefono2Tel: '+526622383656',
  whatsappDisplay: '(662) 238-3656',
  whatsappWa: '526622383656',
  facebook: 'https://www.facebook.com/reparilandia/?locale=es_LA',
  instagram: 'https://www.instagram.com/reparilandia/',
  youtube: 'https://www.youtube.com/channel/UCmngpD5f7isaY3CqSELmxlg?app=desktop',
} as const;

const panelOpaque =
  'flex w-full flex-col overflow-visible rounded-2xl border border-white/[0.14] bg-[#14141c] shadow-[0_22px_56px_-26px_rgba(0,0,0,0.88),0_0_30px_-14px_rgba(56,189,248,0.13)] ring-1 ring-white/[0.09]';

const innerSection =
  'rounded-lg border border-white/[0.1] bg-[#0f0f16] p-2 sm:p-1 lg:px-1.5 lg:py-1';

const innerSectionMobile =
  'rounded-xl border border-white/[0.08] bg-[#12121a] p-2.5 max-lg:py-2.5 max-lg:px-3.5';

const socialBtn =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition-colors hover:border-cyan-400/35 hover:bg-white/[0.1] hover:text-cyan-100 touch-manipulation active:scale-95 lg:h-9 lg:w-9';

const MONITO_SOMBRERO = '/assets/contacto-monito-izq-busto.png';
const ILUSTRACION_CONTACTO = '/assets/contacto-ilustracion-recuerdos.png';

function getWhatsAppUrl() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || CONTACT.whatsappWa;
  const message =
    '¡Hola, Reparilandia! Me gustaría recibir más información sobre sus servicios.';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const contactoMobileSubmitBtn =
  'contacto-mobile-submit-btn flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-[17px] font-semibold leading-none text-[#0a0c12] shadow-[0_2px_12px_rgba(0,0,0,0.35)] touch-manipulation active:opacity-90 disabled:opacity-50';

function ContactoMobileMessageView({ onBack }: { onBack: () => void }) {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div
      className={`contacto-mobile-message ${panelOpaque} flex w-full flex-col overflow-hidden p-2 sm:p-2.5 max-lg:h-full max-lg:min-h-0 max-lg:flex-1 max-lg:p-2.5`}
      variants={panelSwapVariants}
      custom={1}
      initial="enter"
      animate="center"
      exit="exit"
      transition={PANEL_SWAP_TRANSITION}
    >
      <motion.button
        type="button"
        onClick={onBack}
        className="contacto-mobile-message-chrome mb-2 flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] font-space text-[11px] font-semibold uppercase tracking-[0.12em] text-white touch-manipulation active:scale-[0.98]"
        whileTap={{ scale: 0.99 }}
        transition={MOTION_IOS_SPRING}
      >
        <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={2} />
        Regresar a contacto
      </motion.button>
      <p className="contacto-mobile-message-title mb-2 shrink-0 font-orbitron text-[12px] tracking-[0.14em] text-cyan-100/95 sm:text-[13px]">
        ENVIAR MENSAJE
      </p>
      <div className="contacto-mobile-message-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] max-lg:flex max-lg:min-h-0 max-lg:flex-col max-lg:justify-between">
        <div className="contacto-mobile-fit-root contacto-mobile-message-form flex w-full min-h-0 flex-col gap-2 pb-1 max-lg:min-h-full max-lg:flex-1 max-lg:justify-between">
          <ContactForm
            embedded
            hideInlineSubmit
            onLoadingChange={setSubmitLoading}
            onSubmittedChange={setSubmitted}
          />
          {!submitted ? (
            <div className="contacto-mobile-message-footer shrink-0 border-t border-white/[0.08] bg-[#14141c] pt-2.5 pb-1">
              <motion.button
                type="submit"
                form={CONTACT_FORM_ID}
                disabled={submitLoading}
                className={contactoMobileSubmitBtn}
                whileTap={{ scale: submitLoading ? 1 : 0.98 }}
              >
                <Send className="h-5 w-5 shrink-0" />
                {submitLoading ? 'Enviando…' : 'Enviar mensaje'}
              </motion.button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

function ContactoMobileCard({ onOpenMessage }: { onOpenMessage: () => void }) {
  const { email, telefonoDisplay, telefonoTel, telefono2Display, telefono2Tel, whatsappDisplay, facebook, instagram, youtube } =
    CONTACT;
  const { workshopAddress, googleMapsUrl } = getWorkshopLocation();

  const whatsappUrl = getWhatsAppUrl();

  return (
    <motion.div
      className="contacto-mobile-view min-h-0 w-full max-lg:flex-1 max-lg:min-h-0 max-lg:max-h-full"
      variants={panelSwapVariants}
      custom={-1}
      initial="enter"
      animate="center"
      exit="exit"
      transition={PANEL_SWAP_TRANSITION}
    >
      <motion.div
        className={`contacto-mobile-card ${panelOpaque} flex h-full min-h-0 w-full max-h-full flex-col overflow-hidden overflow-x-hidden p-2 sm:p-2.5 max-lg:flex-1 max-lg:p-2.5`}
      >
        <div className="contacto-mobile-fit-root contacto-mobile-card-body grid min-h-0 min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-1 overflow-hidden">
        <div className="contacto-mobile-social flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] pb-1">
          <span className="contacto-mobile-label font-space text-[12px] uppercase tracking-[0.16em] text-white/55">Síguenos</span>
          <motion.div className="flex flex-wrap gap-1">
            <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={socialBtn}>
              <Facebook className="h-4 w-4" />
            </a>
            <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialBtn}>
              <Instagram className="h-4 w-4" />
            </a>
            <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={socialBtn}>
              <Youtube className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        <div className="contacto-mobile-sections mt-0 flex min-h-0 min-w-0 flex-col justify-evenly gap-[var(--contacto-mobile-section-gap,0.4rem)]">
          <section className={`${innerSectionMobile} flex min-h-0 min-w-0 flex-1 flex-col justify-center`}>
            <motion.div className="contacto-mobile-section-title mb-1 flex items-center justify-center gap-1.5 font-orbitron text-[12px] tracking-[0.12em] text-cyan-100/95">
              <Mail className="h-3 w-3 text-hologram-cyan" />
              CORREO
            </motion.div>
            <a href={`mailto:${email}`} className="contacto-mobile-link break-all font-space text-xs text-sky-200/95 hover:underline">
              {email}
            </a>
            <motion.div className="contacto-mobile-phone-list mt-1 space-y-0.5 border-t border-white/[0.08] pt-1">
              <motion.div className="contacto-mobile-phone-row flex items-center justify-center gap-1.5 text-[12px] text-white/88">
                <Phone className="h-3.5 w-3.5 text-hologram-gold" />
                <a href={`tel:${telefonoTel}`} className="font-space text-sky-200/95 hover:underline">
                  {telefonoDisplay}
                </a>
              </motion.div>
              <motion.div className="contacto-mobile-phone-row flex items-center justify-center gap-1.5 text-[12px] text-white/88">
                <Phone className="h-3.5 w-3.5 text-hologram-gold" />
                <a href={`tel:${telefono2Tel}`} className="font-space text-sky-200/95 hover:underline">
                  {telefono2Display}
                </a>
              </motion.div>
              <motion.div className="contacto-mobile-phone-row flex items-center justify-center gap-1.5 text-[12px] text-white/88">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-300/90" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-space text-emerald-200/95 hover:underline"
                >
                  {whatsappDisplay}
                </a>
              </motion.div>
            </motion.div>
          </section>

          <section className={`${innerSectionMobile} flex min-h-0 min-w-0 flex-1 flex-col justify-center`}>
            <motion.div className="contacto-mobile-section-title mb-1 flex items-center justify-center gap-1.5 font-orbitron text-[12px] tracking-[0.12em] text-amber-100/95">
              <MapPin className="h-3 w-3 text-amber-200/90" />
              DIRECCIÓN
            </motion.div>
            <p className="contacto-mobile-body-text font-space text-xs leading-relaxed text-white/90">{workshopAddress}</p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-md border border-sky-400/30 bg-sky-500/15 px-2 py-1 font-space text-xs font-semibold text-sky-100/95 touch-manipulation"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir en Google Maps
            </a>
          </section>

          <section className={`${innerSectionMobile} flex min-h-0 min-w-0 flex-1 flex-col justify-center`}>
            <motion.div className="contacto-mobile-section-title mb-1 flex items-center justify-center gap-1.5 font-orbitron text-[12px] tracking-[0.12em] text-emerald-100/95">
              <Clock className="h-3 w-3 text-emerald-300/90" />
              HORARIO
            </motion.div>
            <p className="contacto-mobile-body-text font-space text-[12px] leading-snug text-white/88">
              Lun–vie 8:30–12:50, 14:30–18:50 · Sáb 9–13 · Dom cierre
            </p>
          </section>
        </div>

        <div className="contacto-mobile-actions flex shrink-0 flex-col gap-[var(--contacto-mobile-actions-gap,0.4rem)] border-t border-white/[0.1] pt-[var(--contacto-mobile-actions-pad-top,0.45rem)]">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contacto-mobile-whatsapp-btn flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/35 bg-gradient-to-r from-emerald-500/35 to-teal-600/25 font-space text-[13px] font-semibold uppercase tracking-[0.06em] text-emerald-50 touch-manipulation active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            WhatsApp
          </a>
          <motion.button
            type="button"
            onClick={onOpenMessage}
            className="contacto-mobile-message-btn flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-sky-400/35 bg-sky-500/18 font-space text-[13px] font-semibold uppercase tracking-[0.06em] text-sky-100/95 touch-manipulation active:scale-[0.98]"
            whileTap={{ scale: 0.99 }}
          >
            <Send className="h-4 w-4 shrink-0" />
            Enviar mensaje
          </motion.button>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


export default function ContactoScreen({ isScreenActive = true }: { isScreenActive?: boolean }) {
  const [showMessage, setShowMessage] = useState(false);

  useContactoMobileZone(isScreenActive);
  useContactoMobileFit(showMessage, isScreenActive);

  const whatsappUrl = getWhatsAppUrl();

  const handleWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const { email, telefonoDisplay, telefonoTel, telefono2Display, telefono2Tel, whatsappDisplay, facebook, instagram, youtube } =
    CONTACT;

  const { workshopAddress, googleMapsUrl } = getWorkshopLocation();

  return (
    <>
      <MobileScreenLayout
        title="CONTACTO"
        lead="Correo, WhatsApp o mensaje directo."
        hideLeadOnMobile
        className="contacto-screen"
        data-screen="contacto"
        headerOverlay={
          <img
            src={assetUrl(MONITO_SOMBRERO)}
            alt=""
            className="contacto-monito-header pointer-events-none hidden max-lg:!hidden select-none object-contain object-left-bottom drop-shadow-[0_14px_28px_rgba(0,0,0,0.5)] [image-rendering:auto] lg:block"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        }
      >
        <motion.div className="contacto-mobile-stage flex min-h-0 w-full flex-col overflow-hidden max-lg:flex-1 max-lg:min-h-0 max-lg:max-h-full lg:flex-1 lg:justify-start lg:pt-2 xl:pt-3">
          <motion.div className="contacto-mobile-wrap flex min-h-0 w-full flex-col overflow-hidden max-lg:flex-1 max-lg:min-h-0 max-lg:h-full lg:hidden">
            <AnimatePresence mode="wait" initial={false}>
              {showMessage ? (
                <ContactoMobileMessageView key="message" onBack={() => setShowMessage(false)} />
              ) : (
                <ContactoMobileCard key="contact" onOpenMessage={() => setShowMessage(true)} />
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div className="contacto-desktop-grid mx-auto hidden min-h-0 max-h-full w-full min-w-0 max-w-[min(100%,80rem)] flex-1 shrink-0 grid-cols-2 items-start justify-items-stretch gap-x-5 gap-y-1 overflow-visible pt-0 lg:grid lg:mt-0.5 lg:translate-y-1.5 xl:mt-1 xl:translate-y-2">
            <motion.div className="contacto-monito-col relative flex w-full min-w-0 flex-col overflow-visible lg:translate-y-[4.5rem] xl:translate-y-[5.75rem]">
              <motion.div
                className={`contacto-info-panel relative z-[30] ${panelOpaque} mt-0 p-1.5 lg:mt-8 xl:mt-9`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <motion.div className="pointer-events-none absolute bottom-0 left-0 z-[1] h-10 w-[45%] rounded-[100%] bg-black/35 blur-lg" aria-hidden />
                <div className="contacto-info-body relative z-[2] flex min-h-0 flex-col gap-0.5 overflow-visible px-1.5 py-1">
                  <div className="flex flex-wrap items-start gap-x-1.5 gap-y-1 border-b border-white/[0.07] pb-1">
                    <motion.div className="min-h-[4.25rem] min-w-[13.5rem] shrink-0" aria-hidden />
                    <div className="ml-auto flex min-w-0 flex-col items-end gap-1.5">
                      <span className="font-space text-[11px] uppercase tracking-[0.2em] text-white/50">Síguenos</span>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={socialBtn}>
                          <Facebook className="h-[1.15rem] w-[1.15rem]" />
                        </a>
                        <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialBtn}>
                          <Instagram className="h-[1.15rem] w-[1.15rem]" />
                        </a>
                        <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={socialBtn}>
                          <Youtube className="h-[1.15rem] w-[1.15rem]" />
                        </a>
                        <a href={`mailto:${email}`} aria-label="Correo" className={socialBtn}>
                          <Mail className="h-[1.15rem] w-[1.15rem]" />
                        </a>
                        <a href={`tel:${telefonoTel}`} aria-label="Teléfono" className={socialBtn}>
                          <Phone className="h-[1.15rem] w-[1.15rem]" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <section className={innerSection}>
                    <div className="mb-0.5 flex items-center gap-1.5 font-orbitron text-[12px] tracking-[0.14em] text-cyan-100/95 md:text-[14px]">
                      <Mail className="h-3.5 w-3.5 text-hologram-cyan" />
                      CORREO
                    </div>
                    <a href={`mailto:${email}`} className="break-all font-space text-[14px] text-sky-200/95 hover:underline md:text-xs">
                      {email}
                    </a>
                    <div className="mt-1 space-y-0.5 border-t border-white/[0.08] pt-1">
                      <motion.div className="flex items-center gap-1.5 font-orbitron text-[12px] text-white/85 md:text-[14px]">
                        <Phone className="h-4 w-4 text-hologram-gold" />
                        <a href={`tel:${telefonoTel}`} className="font-space text-sky-200/95 hover:underline">
                          {telefonoDisplay}
                        </a>
                      </motion.div>
                      <motion.div className="flex items-center gap-1.5 font-orbitron text-[12px] text-white/85 md:text-[14px]">
                        <Phone className="h-4 w-4 text-hologram-gold" />
                        <a href={`tel:${telefono2Tel}`} className="font-space text-sky-200/95 hover:underline">
                          {telefono2Display}
                        </a>
                      </motion.div>
                      <motion.div className="flex items-center gap-1.5 font-orbitron text-[12px] text-white/85 md:text-[14px]">
                        <MessageCircle className="h-4 w-4 text-emerald-300/90" />
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-space text-emerald-200/95 hover:underline"
                        >
                          {whatsappDisplay}
                        </a>
                      </motion.div>
                    </div>
                  </section>

                  <section className={innerSection}>
                    <div className="mb-0.5 flex items-center gap-1.5 font-orbitron text-[12px] tracking-[0.14em] text-amber-100/95 md:text-[14px]">
                      <MapPin className="h-3.5 w-3.5 text-amber-200/90" />
                      DIRECCIÓN
                    </div>
                    <p className="font-space text-[14px] text-white/88 md:text-xs">{workshopAddress}</p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex min-h-[34px] w-full items-center justify-center gap-1 rounded-md border border-sky-400/30 bg-sky-500/15 px-2 py-1 font-space text-[12px] font-semibold text-sky-100/95 touch-manipulation lg:text-[13px]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Abrir en Google Maps
                    </a>
                  </section>

                  <section className={innerSection}>
                    <div className="mb-0.5 flex items-center gap-1.5 font-orbitron text-[12px] tracking-[0.14em] text-emerald-100/95 md:text-[14px]">
                      <Clock className="h-3.5 w-3.5 text-emerald-300/90" />
                      HORARIO
                    </div>
                    <p className="font-space text-[12px] text-white/88 md:text-[14px]">
                      Lun–vie 8:30–12:50, 14:30–18:50 · Sáb 9–13 · Dom cierre
                    </p>
                  </section>

                  <motion.button
                    type="button"
                    onClick={handleWhatsApp}
                    className="mt-1 flex min-h-[38px] shrink-0 w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-400/25 bg-gradient-to-r from-emerald-500/25 to-teal-600/20 px-2.5 py-1.5 text-xs font-semibold text-emerald-50 touch-manipulation"
                    whileTap={{ scale: 0.99 }}
                  >
                    <MessageCircle className="h-[1.125rem] w-[1.125rem]" />
                    WHATSAPP
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="relative flex min-h-0 w-full min-w-0 flex-col overflow-hidden lg:translate-y-5 xl:translate-y-6">
              <motion.div
                className={`relative z-[12] ${panelOpaque} flex min-h-0 flex-1 flex-col overflow-hidden p-2`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <motion.div className="relative z-[20] flex min-h-0 flex-1 flex-col overflow-hidden px-2 pb-1 pt-1">
                  <p className="mb-0.5 font-orbitron text-[12px] tracking-[0.12em] text-cyan-100/85 md:text-[14px]">ENVIAR MENSAJE</p>
                  <ContactForm embedded />
                </motion.div>
              </motion.div>
              <motion.div className="relative z-[11] mx-auto mt-4 flex w-full max-w-[min(98%,34rem)] shrink-0 translate-y-4 justify-center xl:mt-5 xl:max-w-[min(100%,36rem)] xl:translate-y-5">
                <img
                  src={assetUrl(ILUSTRACION_CONTACTO)}
                  alt=""
                  className="pointer-events-none block h-auto w-full max-h-[min(24dvh,13.5rem)] object-contain object-bottom [image-rendering:auto] sm:max-h-[min(26dvh,14.5rem)] xl:max-h-[min(28dvh,16.25rem)]"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </MobileScreenLayout>
    </>
  );
}
