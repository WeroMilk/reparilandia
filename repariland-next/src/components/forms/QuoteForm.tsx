import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, CheckCircle, ImagePlus } from 'lucide-react';
import { saveQuote } from '@/lib/formActions';
import {
  ALLOWED_IMAGE_ACCEPT,
  isAllowedImageFile,
  isValidEmail,
  MAX_FILE_BYTES,
} from '@/lib/form-validation';

interface QuoteFormProps {
  serviceName: string;
  onClose: () => void;
}

const shellBase =
  'quote-form-shell w-full mx-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-[rgba(12,12,18,0.94)] backdrop-blur-xl shadow-[0_32px_96px_rgba(0,0,0,0.65)] relative overflow-hidden ring-1 ring-white/[0.07] flex flex-col min-h-0 transition-[max-width] duration-300 ease-out';

function quoteShellClass(hasPreview: boolean) {
  return `${shellBase} ${hasPreview ? 'quote-form-shell--with-preview max-w-[min(94vw,50rem)]' : 'max-w-2xl'}`;
}

const labelClass = 'block font-space text-white text-xs font-medium mb-1 sm:text-sm sm:mb-1.5 tracking-wide';
const inputClass =
  'w-full min-h-[var(--touch-min)] rounded-xl sm:rounded-2xl border border-white/12 bg-black/35 px-3 py-2.5 text-sm text-white placeholder:text-white/50 font-space focus:outline-none transition-[border-color,box-shadow] focus:border-hologram-cyan/55 focus:shadow-[0_0_0_2px_rgba(0,191,255,0.12)] sm:px-4 sm:py-3';

export default function QuoteForm({ serviceName, onClose }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio_seleccionado: serviceName,
    descripcion: '',
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData((prev) =>
      prev.servicio_seleccionado === serviceName
        ? prev
        : { ...prev, servicio_seleccionado: serviceName },
    );
  }, [serviceName]);

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    const file = e.target.files?.[0];
    if (!file) {
      setFoto(null);
      setFotoPreview(null);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setFoto(null);
      setFotoPreview(null);
      setSubmitError('La imagen no debe superar 5 MB.');
      e.target.value = '';
      return;
    }
    if (!isAllowedImageFile(file)) {
      setFoto(null);
      setFotoPreview(null);
      setSubmitError('Formato no válido. Usa JPG, PNG, WEBP, GIF o HEIC.');
      e.target.value = '';
      return;
    }
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nombre = formData.nombre.trim();
    const email = formData.email.trim();
    const telefono = formData.telefono.trim();
    const descripcion = formData.descripcion.trim();
    const servicio = serviceName.trim() || formData.servicio_seleccionado.trim();

    if (!nombre || !telefono || !descripcion || !servicio) {
      setSubmitError('Completa todos los campos obligatorios.');
      return;
    }
    if (!isValidEmail(email)) {
      setSubmitError('Introduce un correo electrónico válido.');
      return;
    }
    if (!foto) {
      setSubmitError('Sube una fotografía del equipo para continuar.');
      return;
    }

    setLoading(true);
    setSubmitError(null);

    const payload = new FormData();
    payload.append('nombre', nombre);
    payload.append('email', email);
    payload.append('telefono', telefono);
    payload.append('servicio_seleccionado', servicio);
    payload.append('descripcion', descripcion);
    payload.append('foto', foto);

    const result = await saveQuote(payload);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setSubmitError(result.error ?? 'No se pudo enviar la solicitud. Intenta de nuevo.');
    }
  };

  if (submitted) {
    return (
      <motion.div
        className={`${quoteShellClass(false)} p-6 sm:p-8 md:p-10 text-center`}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-hologram-cyan mx-auto mb-5" />
        <h3 className="font-orbitron text-xl md:text-2xl text-holographic mb-3">¡Solicitud enviada!</h3>
        <p className="font-space text-white text-base mb-8 max-w-md mx-auto leading-relaxed">
          Tu cotización y la fotografía del equipo se enviaron al correo de Reparilandia. Te contactaremos pronto.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:text-hologram-cyan font-space text-sm transition-colors"
        >
          Cerrar
        </button>
      </motion.div>
    );
  }

  const hasPreview = Boolean(fotoPreview);

  return (
    <motion.div
      className={quoteShellClass(hasPreview)}
      initial={{ scale: 0.94, y: 16, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.94, y: 16, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      <motion.div className="absolute top-0 right-0 w-px h-24 bg-gradient-to-b from-hologram-cyan/50 to-transparent" />
      <motion.div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-hologram-cyan/50 to-transparent" />

      <motion.div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.06] px-4 pb-2 pt-3 sm:px-5 sm:pb-2.5 sm:pt-3.5 lg:px-4 lg:pb-2 lg:pt-3">
        <motion.div className="min-w-0">
          <p className="font-space text-white text-[12px] uppercase tracking-[0.2em] mb-0.5 sm:text-xs">Cotización</p>
          <h3 className="font-orbitron text-base sm:text-lg md:text-xl text-holographic tracking-wider break-words leading-tight">
            {serviceName}
          </h3>
        </motion.div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/25 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>

      <motion.div
        className={`min-h-0 flex-1 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-4 lg:py-2 ${
          hasPreview
            ? 'overflow-hidden max-lg:native-scroll max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:scrollbar-hide'
            : 'native-scroll overflow-y-auto overscroll-contain scrollbar-hide'
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className={
            hasPreview
              ? 'quote-form-with-preview flex min-h-0 flex-1 flex-col gap-2 sm:gap-2.5'
              : 'space-y-2.5 max-lg:space-y-2 sm:space-y-4'
          }
        >
          <motion.div
            className={
              hasPreview
                ? 'flex min-h-0 flex-col gap-2 sm:gap-2.5 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:grid-rows-[minmax(0,1fr)_auto] lg:gap-x-4 lg:gap-y-2'
                : 'contents'
            }
          >
            <motion.div className={hasPreview ? 'flex min-h-0 flex-col gap-2 sm:gap-2.5 lg:min-h-0 lg:overflow-hidden' : 'contents'}>
              <motion.div>
                <label htmlFor="quote-nombre" className={labelClass}>
                  Nombre
                </label>
                <input
                  enterKeyHint="next"
                  id="quote-nombre"
                  name="nombre"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Tu nombre completo"
                  className={inputClass}
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </motion.div>
              <motion.div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
                <motion.div>
                  <label htmlFor="quote-email" className={labelClass}>
                    Correo electrónico
                  </label>
                  <input
                    enterKeyHint="next"
                    id="quote-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@email.com"
                    className={inputClass}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </motion.div>
                <motion.div>
                  <label htmlFor="quote-telefono" className={labelClass}>
                    Teléfono
                  </label>
                  <input
                    enterKeyHint="next"
                    id="quote-telefono"
                    name="telefono"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+52 (662) 000-0000"
                    className={inputClass}
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </motion.div>
              </motion.div>
              <motion.div className={hasPreview ? 'min-h-0 lg:flex-1 lg:overflow-hidden' : undefined}>
                <label htmlFor="quote-descripcion" className={labelClass}>
                  Descripción del problema
                </label>
                <textarea
                  id="quote-descripcion"
                  name="descripcion"
                  required
                  rows={hasPreview ? 2 : 3}
                  autoComplete="off"
                  placeholder="Describe el problema o lo que necesitas reparar..."
                  className={`${inputClass} resize-none ${
                    hasPreview
                      ? 'min-h-[4.5rem] max-lg:min-h-[4.25rem] lg:min-h-0 lg:max-h-[min(11dvh,5.25rem)]'
                      : 'min-h-[4.5rem] max-lg:min-h-[4.25rem] sm:min-h-[96px]'
                  }`}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className={
                hasPreview
                  ? 'flex min-h-0 flex-col gap-1.5 lg:min-h-0 lg:overflow-hidden'
                  : undefined
              }
            >
              <label htmlFor="quote-foto" className={labelClass}>
                Fotografía del equipo <span className="text-hologram-cyan/90">(obligatoria)</span>
              </label>
              <input
                ref={fotoInputRef}
                id="quote-foto"
                name="foto"
                type="file"
                accept={ALLOWED_IMAGE_ACCEPT}
                required
                className="sr-only"
                onChange={handleFotoChange}
              />
              <button
                type="button"
                onClick={() => fotoInputRef.current?.click()}
                className={`${inputClass} flex w-full items-center justify-center gap-2 border-dashed text-white/80 hover:border-hologram-cyan/45 hover:text-white ${
                  hasPreview ? 'py-2.5 text-xs sm:py-3' : 'py-4'
                }`}
              >
                <ImagePlus className="h-5 w-5 shrink-0 text-hologram-cyan/90" />
                <span className="truncate">{foto ? foto.name : 'Seleccionar imagen (máx. 5 MB)'}</span>
              </button>
              {fotoPreview && (
                <motion.div
                  className={`flex min-h-0 items-center justify-center overflow-hidden rounded-xl border border-white/12 bg-black/40 ${
                    hasPreview
                      ? 'quote-form-preview mt-0 min-h-[min(16dvh,6.5rem)] flex-1 p-1.5 sm:p-2 lg:min-h-[min(12dvh,5.5rem)] lg:max-h-[min(22dvh,8.75rem)]'
                      : 'mt-2 p-2 sm:p-3'
                  }`}
                >
                  <img
                    src={fotoPreview}
                    alt="Vista previa del equipo"
                    className={
                      hasPreview
                        ? 'max-h-full max-w-full object-contain'
                        : 'mx-auto block h-auto max-h-[min(22dvh,8.5rem)] w-auto object-contain'
                    }
                  />
                </motion.div>
              )}
              {!hasPreview && (
                <p className="mt-1.5 font-space text-[12px] leading-snug text-white/55 sm:text-[14px]">
                  La imagen se enviará junto con tus datos al correo del taller para agilizar la cotización.
                </p>
              )}
            </motion.div>
          </motion.div>

          {hasPreview && (
            <p className="shrink-0 font-space text-[12px] leading-snug text-white/55 sm:text-[14px] lg:col-span-2">
              La imagen se enviará junto con tus datos al correo del taller para agilizar la cotización.
            </p>
          )}

          {submitError && (
            <p className="shrink-0 font-space text-xs text-red-300/95 lg:col-span-2" role="alert">
              {submitError}
            </p>
          )}

          <motion.div className={`shrink-0 pb-0.5 pt-0.5 sm:pb-0 ${hasPreview ? 'lg:col-span-2' : ''}`}>
            <motion.button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 py-3 rounded-xl bg-white text-hologram-darker font-semibold text-sm hover:shadow-[0_8px_32px_rgba(0,191,255,0.2)] disabled:opacity-50 disabled:pointer-events-none transition-shadow sm:rounded-2xl sm:py-3.5"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <Send className="w-5 h-5" />
              {loading ? 'Enviando…' : 'Enviar solicitud'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
