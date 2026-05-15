import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Cookie, FileText } from 'lucide-react';

type ModalType = 'privacy' | 'cookies' | 'legal' | null;

/** Ancho amplio; contenido compacto para evitar scroll interno del recuadro */
const legalModalShell =
  'w-[min(96vw,56rem)] max-w-[56rem] mx-auto rounded-3xl border border-white/10 bg-[rgba(12,12,18,0.97)] backdrop-blur-xl shadow-[0_32px_96px_rgba(0,0,0,0.65)] relative overflow-hidden ring-1 ring-white/[0.07]';

export default function FooterLegal() {
  const [modal, setModal] = useState<ModalType>(null);
  const year = new Date().getFullYear();

  const legalModal =
    typeof document !== 'undefined' &&
    createPortal(
      <AnimatePresence>
        {modal && (
          <motion.div
            key="legal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            className="fixed inset-0 z-[13000] flex items-start justify-center overflow-y-auto overflow-x-hidden overscroll-y-contain px-3 py-6 sm:px-4 sm:py-8 md:px-6 safe-pt scrollbar-hide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" aria-hidden />
            <motion.div
              className={`${legalModalShell} relative z-10 my-auto shrink-0`}
              initial={{ scale: 0.94, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute top-0 right-0 h-24 w-px bg-gradient-to-b from-hologram-cyan/50 to-transparent" />
              <div className="pointer-events-none absolute top-0 left-0 h-px w-24 bg-gradient-to-r from-hologram-cyan/50 to-transparent" />

              <div className="p-5 sm:p-6 md:px-10 md:py-8">
                <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
                  <div className="min-w-0">
                    <p className="mb-1 font-space text-xs uppercase tracking-[0.2em] text-white/50">Información</p>
                    <h2
                      id="legal-modal-title"
                      className="font-orbitron text-lg tracking-wider text-holographic sm:text-xl md:text-2xl"
                    >
                      {modal === 'privacy' && 'POLÍTICA DE PRIVACIDAD'}
                      {modal === 'cookies' && 'POLÍTICA DE COOKIES'}
                      {modal === 'legal' && 'AVISO LEGAL'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-white/25 hover:bg-white/10"
                    aria-label="Cerrar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2.5 font-space text-[13px] leading-snug text-white sm:space-y-3 sm:text-sm sm:leading-relaxed md:text-[0.9375rem]">
                  {modal === 'privacy' && (
                    <>
                      <p>
                        <strong className="text-hologram-cyan">1. Responsable del Tratamiento</strong>
                      </p>
                      <p>
                        Reparilandia, con domicilio en Hermosillo, Sonora, México, es responsable del tratamiento de los
                        datos personales recopilados a través de este sitio web.
                      </p>
                      <p>
                        <strong className="text-hologram-cyan">2. Datos Recopilados</strong>
                      </p>
                      <p>
                        Recopilamos: nombre, correo electrónico, teléfono y la información que nos proporciones a
                        través de nuestros formularios de contacto, cotización y citas.
                      </p>
                      <p>
                        <strong className="text-hologram-cyan">3. Finalidad</strong>
                      </p>
                      <p>
                        Los datos se utilizan exclusivamente para: atender solicitudes de cotización, programar citas,
                        responder consultas de contacto y enviar comunicaciones relacionadas con nuestros servicios.
                      </p>
                      <p>
                        <strong className="text-hologram-cyan">4. Derechos ARCO</strong>
                      </p>
                      <p>
                        Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos. Para ejercer
                        estos derechos, contáctanos a través del formulario de contacto.
                      </p>
                      <p>
                        <strong className="text-hologram-cyan">5. Seguridad</strong>
                      </p>
                      <p>
                        Implementamos medidas de seguridad técnicas y administrativas para proteger tus datos personales
                        contra daño, pérdida o uso no autorizado.
                      </p>
                    </>
                  )}
                  {modal === 'cookies' && (
                    <>
                      <p>
                        <strong className="text-hologram-cyan">1. ¿Qué son las cookies?</strong>
                      </p>
                      <p>
                        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un
                        sitio web. Nos ayudan a mejorar tu experiencia de navegación.
                      </p>
                      <p>
                        <strong className="text-hologram-cyan">2. Cookies que utilizamos</strong>
                      </p>
                      <p>
                        <strong className="text-white">Cookies técnicas:</strong> Necesarias para el funcionamiento del
                        sitio (navegación, seguridad).
                      </p>
                      <p>
                        <strong className="text-white">Cookies de preferencias:</strong> Recordar tus preferencias de
                        idioma y configuración.
                      </p>
                      <p>
                        <strong className="text-white">Cookies analíticas:</strong> Nos ayudan a entender cómo interactúas
                        con el sitio (Google Analytics).
                      </p>
                      <p>
                        <strong className="text-hologram-cyan">3. Gestión de cookies</strong>
                      </p>
                      <p>
                        Puedes configurar tu navegador para rechazar todas las cookies o para que te avise cuando se envíe
                        una cookie. Sin embargo, algunas funciones del sitio pueden no funcionar correctamente sin cookies.
                      </p>
                    </>
                  )}
                  {modal === 'legal' && (
                    <>
                      <p>
                        <strong className="text-hologram-cyan">1. Información General</strong>
                      </p>
                      <p>
                        Este sitio web es propiedad de Reparilandia. El acceso y uso de este sitio está sujeto a los
                        términos y condiciones aquí establecidos.
                      </p>
                      <p>
                        <strong className="text-hologram-cyan">2. Propiedad Intelectual</strong>
                      </p>
                      <p>
                        Todo el contenido de este sitio (textos, imágenes, logotipos, diseño) está protegido por derechos de
                        propiedad intelectual. Queda prohibida su reproducción, distribución o uso sin autorización expresa.
                      </p>
                      <p>
                        <strong className="text-hologram-cyan">3. Limitación de Responsabilidad</strong>
                      </p>
                      <p>
                        Reparilandia no se hace responsable de daños directos o indirectos derivados del uso de este sitio
                        web. La información proporcionada es orientativa y puede modificarse sin previo aviso.
                      </p>
                      <p>
                        <strong className="text-hologram-cyan">4. Legislación Aplicable</strong>
                      </p>
                      <p>
                        Este aviso legal se rige por las leyes de los Estados Unidos Mexicanos. Cualquier controversia se
                        someterá a la jurisdicción de los tribunales de Hermosillo, Sonora.
                      </p>
                      <p>
                        <strong className="text-hologram-cyan">5. Contacto</strong>
                      </p>
                      <p>Para cualquier consulta legal, utilice el formulario de contacto disponible en este sitio web.</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
      <div className="dock-footer-rail relative z-30 w-full shrink-0 border-t border-white/[0.06] bg-transparent">
        <div className="flex h-full flex-nowrap items-center justify-center gap-x-2 gap-y-0 px-3">
          <span className="shrink-0 font-space text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85">
            © {year} REPARILANDIA
          </span>
          <span className="text-white/35 select-none" aria-hidden>
            ·
          </span>
          <div className="flex shrink-0 items-center justify-center gap-x-2">
            <button
              type="button"
              data-dock-action="privacy"
              onClick={() => setModal('privacy')}
              className="flex h-8 items-center justify-center gap-1 px-1.5 font-space text-[10px] text-white/75 transition-colors hover:text-white active:text-hologram-cyan touch-manipulation"
            >
              <Shield className="h-3.5 w-3.5 shrink-0" />
              Privacidad
            </button>
            <span className="text-white/35 select-none" aria-hidden>
              ·
            </span>
            <button
              type="button"
              data-dock-action="cookies"
              onClick={() => setModal('cookies')}
              className="flex h-8 items-center justify-center gap-1 px-1.5 font-space text-[10px] text-white/75 transition-colors hover:text-white active:text-hologram-cyan touch-manipulation"
            >
              <Cookie className="h-3.5 w-3.5 shrink-0" />
              Cookies
            </button>
            <span className="text-white/35 select-none" aria-hidden>
              ·
            </span>
            <button
              type="button"
              data-dock-action="legal"
              onClick={() => setModal('legal')}
              className="flex h-8 items-center justify-center gap-1 px-1.5 font-space text-[10px] text-white/75 transition-colors hover:text-white active:text-hologram-cyan touch-manipulation"
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              Términos
            </button>
          </div>
        </div>
      </div>

      {legalModal}
    </>
  );
}
