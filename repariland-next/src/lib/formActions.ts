/** Envío local de formularios (sin backend). Úsalo para conectar un API propio más adelante. */

export async function saveQuote(data: {
  nombre: string;
  email: string;
  telefono: string;
  servicio_seleccionado: string;
  descripcion: string;
}) {
  console.info('[cotización]', data);
  return { success: true as const, data: null };
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
