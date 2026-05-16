/** Envío de formularios al API de Next.js (cotización con adjunto por correo). */

export async function saveQuote(formData: FormData) {
  try {
    const response = await fetch('/api/cotizacion', {
      method: 'POST',
      body: formData,
    });

    const result = (await response.json()) as { success?: boolean; error?: string };

    if (!response.ok || !result.success) {
      console.warn('[cotización]', result.error ?? response.statusText);
      return { success: false as const, error: result.error ?? 'Error al enviar' };
    }

    return { success: true as const, data: null };
  } catch (error) {
    console.error('[cotización]', error);
    return { success: false as const, error: 'Error de conexión' };
  }
}

export async function saveAppointment(data: {
  nombre: string;
  email: string;
  telefono: string;
  fecha_hora: string;
  numero_personas: number;
  tipo_cita: string;
  notas: string;
}) {
  console.info('[cita]', data);
  return { success: true as const, data: null };
}

export async function saveContact(data: {
  nombre: string;
  email: string;
  motivo: string;
  mensaje: string;
}) {
  console.info('[contacto]', data);
  return { success: true as const, data: null };
}
