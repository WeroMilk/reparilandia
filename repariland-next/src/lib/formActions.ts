/** Envío de formularios al API de Next.js (correo vía SMTP o Resend). */

type ApiResult = { success?: boolean; error?: string };

async function readApiResult(response: Response): Promise<ApiResult> {
  const text = await response.text();
  if (!text) {
    if (response.status === 503) {
      return {
        success: false,
        error:
          'El envío por correo no está disponible en este momento. Intenta más tarde o escríbenos por WhatsApp.',
      };
    }
    return { success: false, error: 'El servidor no respondió correctamente.' };
  }
  try {
    return JSON.parse(text) as ApiResult;
  } catch {
    return {
      success: false,
      error:
        response.status >= 500
          ? 'Error del servidor. Intenta más tarde.'
          : 'No se pudo procesar la respuesta del servidor.',
    };
  }
}

export async function saveQuote(formData: FormData) {
  try {
    const response = await fetch('/api/cotizacion', {
      method: 'POST',
      body: formData,
    });

    const result = await readApiResult(response);

    if (!response.ok || !result.success) {
      return { success: false as const, error: result.error ?? 'Error al enviar la solicitud.' };
    }

    return { success: true as const, data: null };
  } catch {
    return { success: false as const, error: 'Error de conexión. Revisa tu internet e intenta de nuevo.' };
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
  return { success: true as const, data: null };
}

export async function saveContact(data: {
  nombre: string;
  email: string;
  motivo: string;
  mensaje: string;
}) {
  try {
    const response = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await readApiResult(response);

    if (!response.ok || !result.success) {
      return { success: false as const, error: result.error ?? 'Error al enviar el mensaje.' };
    }

    return { success: true as const, data: null };
  } catch {
    return { success: false as const, error: 'Error de conexión. Revisa tu internet e intenta de nuevo.' };
  }
}
