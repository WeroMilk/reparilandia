import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { saveContact } from '@/lib/formActions';
import { isValidEmail } from '@/lib/form-validation';

export const CONTACT_FORM_ID = 'contact-form';

const labelClass =
  'block font-space text-white text-xs sm:text-sm font-medium mb-1 tracking-wide';
const labelClassEmbedded =
  'block font-space text-white/95 text-[12px] sm:text-[12px] font-medium mb-0.5 tracking-wide lg:mb-0';
const inputClass =
  'w-full min-h-[44px] rounded-xl border border-white/[0.1] bg-black/25 px-3 py-2.5 text-sm sm:text-base text-white placeholder:text-white/45 font-space focus:outline-none transition-[border-color,box-shadow] focus:border-hologram-cyan/50 focus:shadow-[0_0_0_2px_rgba(0,191,255,0.1)] touch-manipulation';
const inputClassEmbedded =
  'w-full min-h-[44px] rounded-md border border-white/[0.1] bg-black/25 px-2.5 py-2 text-[16px] sm:text-[16px] text-white placeholder:text-white/45 font-space focus:outline-none transition-[border-color,box-shadow] focus:border-hologram-cyan/50 focus:shadow-[0_0_0_2px_rgba(0,191,255,0.1)] touch-manipulation lg:min-h-[36px] lg:rounded-lg lg:px-2.5 lg:py-2';

const submitBtnClass =
  'flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-hologram-darker font-semibold text-sm sm:text-[19px] active:opacity-90 disabled:opacity-50 transition-opacity touch-manipulation';
const submitBtnClassEmbedded =
  'flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-hologram-darker font-semibold text-xs active:opacity-90 disabled:opacity-50 transition-opacity touch-manipulation lg:min-h-[40px] lg:py-1.5 lg:text-sm';

interface ContactFormProps {
  /** En tarjetas embebidas (p. ej. Contacto): altura al contenido, sin estirar al alto del vecino. */
  embedded?: boolean;
  /** Móvil contacto: el enviar va en un pie fijo fuera del formulario. */
  hideInlineSubmit?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  onSubmittedChange?: (submitted: boolean) => void;
}

export default function ContactForm({
  embedded = false,
  hideInlineSubmit = false,
  onLoadingChange,
  onSubmittedChange,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    motivo: '',
    mensaje: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  useEffect(() => {
    onSubmittedChange?.(submitted);
  }, [submitted, onSubmittedChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      motivo: formData.motivo.trim(),
      mensaje: formData.mensaje.trim(),
    };

    if (!payload.nombre || !payload.motivo || !payload.mensaje) {
      setSubmitError('Completa todos los campos obligatorios.');
      return;
    }
    if (!isValidEmail(payload.email)) {
      setSubmitError('Introduce un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setSubmitError(null);
    const result = await saveContact(payload);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setSubmitError(result.error ?? 'No se pudo enviar el mensaje. Intenta de nuevo.');
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="panel-glass flex h-full min-h-[8rem] flex-col items-center justify-center rounded-xl p-3 text-center sm:p-4 md:col-span-2"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <CheckCircle className="w-9 h-9 text-hologram-cyan mx-auto mb-1.5" />
        <h3 className="font-orbitron text-sm text-holographic mb-0.5">¡Mensaje enviado!</h3>
        <p className="font-space text-white text-[12px] sm:text-[14px] leading-snug">
          Gracias por contactarnos. Te responderemos a la brevedad.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.form
        id={CONTACT_FORM_ID}
        onSubmit={handleSubmit}
        className={
          embedded
            ? 'relative flex w-full flex-col gap-0'
            : 'relative order-3 mx-auto flex w-full max-w-none flex-col gap-3 rounded-xl p-3.5 sm:p-4 max-md:panel-glass max-md:overflow-visible md:contents'
        }
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 280, damping: 28 }}
      >
        <div className="absolute top-0 right-0 hidden w-px max-md:block h-8 bg-gradient-to-b from-hologram-cyan/35 to-transparent pointer-events-none md:hidden" />

        <div
          className={`panel-glass relative flex w-full flex-col rounded-lg ${
            embedded ? 'gap-2 p-2 sm:gap-2 sm:p-2 lg:gap-1.5 lg:p-1.5' : 'gap-3 p-3.5 sm:p-4'
          } ${
            embedded
              ? 'min-h-0 overflow-visible md:overflow-visible'
              : 'min-h-0 md:[grid-area:formfields] md:min-h-[0] md:h-full md:overflow-hidden'
          }`}
        >
          <div className="absolute top-0 right-0 hidden h-8 w-px bg-gradient-to-b from-hologram-cyan/35 to-transparent pointer-events-none md:block" />

          <div className={`grid shrink-0 grid-cols-1 lg:grid-cols-2 ${embedded ? 'gap-1.5 sm:gap-2' : 'gap-3'}`}>
            <div>
              <label htmlFor="contact-nombre" className={embedded ? labelClassEmbedded : labelClass}>
                Nombre
              </label>
              <input
                enterKeyHint="next"
                id="contact-nombre"
                name="nombre"
                type="text"
                required
                autoComplete="name"
                placeholder="Nombre"
                className={embedded ? inputClassEmbedded : inputClass}
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className={embedded ? labelClassEmbedded : labelClass}>
                Correo
              </label>
              <input
                enterKeyHint="next"
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="email"
                className={embedded ? inputClassEmbedded : inputClass}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div
            className={`flex flex-col ${embedded ? 'gap-1.5 sm:gap-2' : 'gap-3'} ${
              embedded
                ? hideInlineSubmit
                  ? 'contacto-mobile-form-stack min-h-0 flex-1'
                  : 'min-h-0'
                : 'min-h-0 flex-1 md:min-h-[0] md:flex-1'
            }`}
          >
            <div className="flex shrink-0 flex-col gap-0">
              <label htmlFor="contact-motivo" className={embedded ? labelClassEmbedded : labelClass}>
                Motivo
              </label>
              <input
                id="contact-motivo"
                name="motivo"
                type="text"
                required
                autoComplete="off"
                placeholder="¿Por qué nos contactas?"
                className={embedded ? inputClassEmbedded : inputClass}
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              />
            </div>
            <div
              className={
                embedded
                  ? hideInlineSubmit
                    ? 'contacto-mobile-form-message flex min-h-0 flex-1 flex-col'
                    : 'flex flex-col'
                  : 'flex min-h-0 flex-1 flex-col'
              }
            >
              <label htmlFor="contact-mensaje" className={embedded ? labelClassEmbedded : labelClass}>
                Mensaje
              </label>
              <textarea
                id="contact-mensaje"
                name="mensaje"
                required
                rows={embedded ? 2 : 4}
                autoComplete="off"
                placeholder="Tu mensaje…"
                className={`${embedded ? inputClassEmbedded : inputClass} resize-none ${embedded ? 'min-h-[3rem] lg:min-h-[3.25rem]' : 'min-h-[5.5rem] max-md:min-h-[6.25rem] md:min-h-[5.5rem]'} ${embedded ? '' : 'flex-1'}`}
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
              />
            </div>
          </div>

          {submitError && (
            <p className="shrink-0 font-space text-xs text-red-300/95" role="alert">
              {submitError}
            </p>
          )}

          {!hideInlineSubmit ? (
            <motion.button
              type="submit"
              disabled={loading}
              className={`${embedded ? submitBtnClassEmbedded : submitBtnClass} mt-0.5 ${embedded ? '' : 'md:hidden'}`}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <Send className="w-4 h-4" />
              {loading ? 'Enviando…' : 'Enviar mensaje'}
            </motion.button>
          ) : null}
        </div>
      </motion.form>

      <motion.button
        type="submit"
        form={CONTACT_FORM_ID}
        disabled={loading}
        className={`${submitBtnClass} ${embedded ? 'hidden' : 'hidden md:flex md:[grid-area:submit] md:self-stretch'}`}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Send className="w-4 h-4" />
        {loading ? 'Enviando…' : 'Enviar mensaje'}
      </motion.button>
    </>
  );
}
