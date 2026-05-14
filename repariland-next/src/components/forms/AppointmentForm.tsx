import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import { saveAppointment } from '@/lib/formActions';

interface AppointmentFormProps {
  onClose: () => void;
}

const shell =
  'w-full max-w-2xl mx-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-[rgba(12,12,18,0.96)] backdrop-blur-xl shadow-[0_32px_96px_rgba(0,0,0,0.65)] relative overflow-hidden ring-1 ring-white/[0.07] flex flex-col max-h-[calc(100dvh-12px)] sm:max-h-[calc(100dvh-24px)]';

const labelClass =
  'block font-space text-white text-[11px] sm:text-xs font-medium mb-1 tracking-wide';
const inputClass =
  'w-full rounded-xl border border-white/12 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-white font-space focus:outline-none transition-[border-color,box-shadow] focus:border-hologram-cyan/55 focus:shadow-[0_0_0_2px_rgba(0,191,255,0.12)]';
const selectClass = `${inputClass} appearance-none cursor-pointer py-2`;

export default function AppointmentForm({ onClose }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha_hora: '',
    numero_personas: 1,
    tipo_cita: 'tour' as 'tour' | 'reparacion',
    notas: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await saveAppointment(formData);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="w-full max-w-2xl mx-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-[rgba(12,12,18,0.96)] backdrop-blur-xl shadow-[0_32px_96px_rgba(0,0,0,0.65)] relative overflow-hidden ring-1 ring-white/[0.07] max-h-[calc(100dvh-12px)] flex flex-col items-center justify-center p-6 sm:p-8 text-center"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <CheckCircle className="w-14 h-14 text-hologram-cyan mx-auto mb-4" />
        <h3 className="font-orbitron text-lg sm:text-xl text-holographic mb-2">¡Cita registrada!</h3>
        <p className="font-space text-white text-sm max-w-md mx-auto leading-relaxed">
          Hemos recibido tu solicitud. Te contactaremos para confirmar tu cita.
        </p>
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
      initial={{ scale: 0.96, y: 8, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.96, y: 8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    >
      <div className="absolute top-0 right-0 w-px h-16 bg-gradient-to-b from-hologram-gold/50 to-transparent pointer-events-none" />

      <div className="flex-shrink-0 flex items-start justify-between gap-3 px-3 pt-3 pb-2 sm:px-4 sm:pt-4 border-b border-white/[0.06]">
        <div className="min-w-0 flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-hologram-gold/15 border border-hologram-gold/30 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-hologram-gold" />
          </div>
          <div className="min-w-0">
            <p className="font-space text-white text-[10px] uppercase tracking-[0.18em] mb-0.5">Agenda</p>
            <h3 className="font-orbitron text-sm sm:text-base md:text-lg text-holographic tracking-wide leading-tight">
              Programar cita o tour
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 min-h-0 px-3 pb-3 pt-2 sm:px-4 sm:pb-4 gap-2 overflow-hidden"
      >
        <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
          <div>
            <label htmlFor="appointment-nombre" className={labelClass}>
              Nombre
            </label>
            <input
              enterKeyHint="next"
              id="appointment-nombre"
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
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="min-w-0">
              <label htmlFor="appointment-email" className={labelClass}>
                Correo
              </label>
              <input
                enterKeyHint="next"
                id="appointment-email"
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
            <div className="min-w-0">
              <label htmlFor="appointment-telefono" className={labelClass}>
                Teléfono
              </label>
              <input
                enterKeyHint="next"
                id="appointment-telefono"
                name="telefono"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+52…"
                className={inputClass}
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="min-w-0">
              <label htmlFor="appointment-fecha-hora" className={`${labelClass} flex items-center gap-1`}>
                <Clock className="w-3 h-3 shrink-0 opacity-90" aria-hidden /> Fecha y hora
              </label>
              <input
                id="appointment-fecha-hora"
                name="fecha_hora"
                type="datetime-local"
                required
                autoComplete="off"
                className={inputClass}
                value={formData.fecha_hora}
                onChange={(e) => setFormData({ ...formData, fecha_hora: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="appointment-numero-personas" className={`${labelClass} flex items-center gap-1`}>
                <Users className="w-3 h-3 shrink-0 opacity-90" aria-hidden /> Personas
              </label>
              <select
                id="appointment-numero-personas"
                name="numero_personas"
                className={selectClass}
                autoComplete="off"
                value={formData.numero_personas}
                onChange={(e) => setFormData({ ...formData, numero_personas: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n} className="bg-hologram-darker">
                    {n} {n === 1 ? 'persona' : 'pers.'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div role="group" aria-labelledby="appointment-tipo-cita-label">
            <p id="appointment-tipo-cita-label" className={labelClass}>
              Tipo de cita
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['tour', 'reparacion'] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  aria-pressed={formData.tipo_cita === tipo}
                  onClick={() => setFormData({ ...formData, tipo_cita: tipo })}
                  className={`py-2 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                    formData.tipo_cita === tipo
                      ? 'border-hologram-cyan bg-hologram-cyan/15 text-hologram-cyan shadow-[0_0_16px_rgba(0,191,255,0.1)]'
                      : 'border border-white/12 text-white hover:border-white/25 hover:bg-white/[0.04]'
                  }`}
                >
                  {tipo === 'tour' ? 'Tour museo' : 'Reparación'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="appointment-notas" className={labelClass}>
              Notas (opcional)
            </label>
            <textarea
              id="appointment-notas"
              name="notas"
              rows={2}
              autoComplete="off"
              placeholder="Algo que debamos saber…"
              className={`${inputClass} resize-none h-11 sm:h-12 leading-snug overflow-hidden`}
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            />
          </div>
        </div>

        <div className="flex-shrink-0 pt-2 border-t border-white/[0.06] mt-auto">
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-hologram-cyan/20 border border-hologram-cyan/45 text-hologram-cyan font-semibold text-sm hover:bg-hologram-cyan/28 transition-colors disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            {loading ? 'Enviando…' : 'Confirmar solicitud'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
