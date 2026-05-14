import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { saveQuote } from '@/lib/formActions';

interface QuoteFormProps {
  serviceName: string;
  onClose: () => void;
}

const shell =
  'w-full max-w-2xl mx-auto rounded-3xl border border-white/10 bg-[rgba(12,12,18,0.94)] backdrop-blur-xl shadow-[0_32px_96px_rgba(0,0,0,0.65)] relative overflow-hidden ring-1 ring-white/[0.07]';

const labelClass = 'block font-space text-white text-sm font-medium mb-2 tracking-wide';
const inputClass =
  'w-full rounded-2xl border border-white/12 bg-black/35 px-4 py-3.5 md:py-4 text-white text-base placeholder:text-white font-space focus:outline-none transition-[border-color,box-shadow] focus:border-hologram-cyan/55 focus:shadow-[0_0_0_3px_rgba(0,191,255,0.12)]';

export default function QuoteForm({ serviceName, onClose }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio_seleccionado: serviceName,
    descripcion: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await saveQuote(formData);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    }
  };

  const handleWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '520000000000';
    const message = `Hola Reparilandia! Solicito cotización para: ${serviceName}\nNombre: ${formData.nombre}\nTel: ${formData.telefono}\nDescripción: ${formData.descripcion}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (submitted) {
    return (
      <motion.div
        className={`${shell} p-8 md:p-12 text-center`}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-hologram-cyan mx-auto mb-5" />
        <h3 className="font-orbitron text-xl md:text-2xl text-holographic mb-3">¡Solicitud enviada!</h3>
        <p className="font-space text-white text-base mb-8 max-w-md mx-auto leading-relaxed">
          Hemos recibido tu solicitud de cotización. Te contactaremos pronto.
        </p>
        <motion.button
          type="button"
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto py-3.5 rounded-2xl bg-emerald-600/25 border border-emerald-400/40 text-emerald-200 font-semibold text-sm hover:bg-emerald-600/35 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle className="w-5 h-5" />
          También por WhatsApp
        </motion.button>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 text-white hover:text-hologram-cyan font-space text-sm transition-colors"
        >
          Cerrar
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={shell}
      initial={{ scale: 0.94, y: 16, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.94, y: 16, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      <div className="absolute top-0 right-0 w-px h-24 bg-gradient-to-b from-hologram-cyan/50 to-transparent" />
      <div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-hologram-cyan/50 to-transparent" />

      <div className="p-6 sm:p-8 md:p-10 lg:p-12 max-h-[min(88vh,920px)] overflow-y-auto scrollbar-hide">
        <div className="flex items-start justify-between gap-4 mb-6 md:mb-8">
          <div className="min-w-0">
            <p className="font-space text-white text-xs uppercase tracking-[0.2em] mb-1">Cotización</p>
            <h3 className="font-orbitron text-lg sm:text-xl md:text-2xl text-holographic tracking-wider break-words">
              {serviceName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-11 h-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/25 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div>
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
          </div>
          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            <div>
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
            </div>
            <div>
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
            </div>
          </div>
          <div>
            <label htmlFor="quote-descripcion" className={labelClass}>
              Descripción del problema
            </label>
            <textarea
              id="quote-descripcion"
              name="descripcion"
              required
              rows={5}
              autoComplete="off"
              placeholder="Describe el problema o lo que necesitas reparar..."
              className={`${inputClass} resize-none min-h-[140px] md:min-h-[160px]`}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <motion.button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-2xl bg-white text-hologram-darker font-semibold text-sm md:text-base hover:shadow-[0_8px_32px_rgba(0,191,255,0.2)] disabled:opacity-50 disabled:pointer-events-none transition-shadow"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <Send className="w-5 h-5" />
              {loading ? 'Enviando…' : 'Enviar solicitud'}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 px-6 py-3.5 md:py-4 rounded-2xl bg-emerald-600/20 border border-emerald-400/35 text-emerald-200 font-semibold text-sm hover:bg-emerald-600/30 transition-colors sm:shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
