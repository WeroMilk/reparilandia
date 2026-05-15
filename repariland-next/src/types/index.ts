export type ScreenName = 'inicio' | 'historia' | 'servicios' | 'noticias' | 'contacto';

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  /** Primer slide: banner de carritos montables */
  heroCarritos?: boolean;
  /** Texto del botón de cotización (por defecto: Cotizar — {title}) */
  quoteCta?: string;
}

export interface QuoteFormData {
  nombre: string;
  email: string;
  telefono: string;
  servicio_seleccionado: string;
  descripcion: string;
}

export interface AppointmentFormData {
  nombre: string;
  email: string;
  telefono: string;
  fecha_hora: string;
  numero_personas: number;
  tipo_cita: 'tour' | 'reparacion';
  notas: string;
}

export interface ContactFormData {
  nombre: string;
  email: string;
  motivo: string;
  mensaje: string;
}

export interface NavButton {
  screen: ScreenName;
  label: string;
  icon: string;
}
