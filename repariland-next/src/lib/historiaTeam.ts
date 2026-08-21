export type HistoriaAccent = 'cyan' | 'amber' | 'rose';

export type HistoriaKpi = {
  value: string;
  label: string;
};

export type HistoriaSkill = {
  label: string;
  value: number;
};

export type HistoriaWorker = {
  src: string;
  alt: string;
  name: string;
  role: string;
  accent: HistoriaAccent;
  kpis: readonly [HistoriaKpi, HistoriaKpi, HistoriaKpi];
  skills: readonly [HistoriaSkill, HistoriaSkill, HistoriaSkill];
  tagline: string;
};

export const historiaMilestones = [
  { year: '1985', text: 'Don Jaime abre el taller con una caja de herramientas y un sueño.' },
  { year: '2000', text: 'Carlos se une al negocio familiar, trayendo visión creativa.' },
  { year: '2010', text: 'El taller evoluciona: coleccionismo y museo.' },
  { year: '2026', text: 'Dos generaciones, una pasión por reparar el pasado.' },
] as const;

export const historiaWorkers: readonly HistoriaWorker[] = [
  {
    src: '/assets/historia-panel-2.webp',
    alt: 'Omar Lugo, integrante del equipo Reparilandia, pelo largo en ponytail',
    name: 'Omar Lugo',
    role: 'Recuperación crítica',
    accent: 'cyan',
    kpis: [
      { value: 'S', label: 'Rango técnico' },
      { value: '99', label: 'Salvamento' },
      { value: '0', label: 'Baja definitiva' },
    ],
    skills: [
      { label: 'Diagnóstico crítico', value: 97 },
      { label: 'Microelectrónica', value: 94 },
      { label: 'Restauración', value: 96 },
    ],
    tagline:
      'Especialista en rescatar equipos que otros dan por perdidos: cámaras, tarjetas madre e impresoras 3D.',
  },
  {
    src: '/assets/historia-panel-3.webp',
    alt: 'Carlos Díaz, integrante del equipo con sombrero y barba',
    name: 'Carlos Díaz',
    role: 'Dirección general',
    accent: 'amber',
    kpis: [
      { value: '26', label: 'Años de mando' },
      { value: 'II', label: 'Generación' },
      { value: 'MAX', label: 'Liderazgo' },
    ],
    skills: [
      { label: 'Dirección', value: 98 },
      { label: 'Estrategia', value: 95 },
      { label: 'Resolución', value: 97 },
    ],
    tagline:
      'Cabeza de Reparilandia: define el rumbo del taller y no cierra un caso mientras quede una vía por explorar.',
  },
  {
    src: '/assets/historia-panel-4.webp',
    alt: 'Francisco Medina, integrante del equipo con gafas y playera Reparilandia',
    name: 'Francisco Medina',
    role: 'Abastecimiento y cotización',
    accent: 'rose',
    kpis: [
      { value: 'S', label: 'Búsqueda' },
      { value: 'A+', label: 'Cotización' },
      { value: 'MAX', label: 'Abastecimiento' },
    ],
    skills: [
      { label: 'Proveeduría', value: 95 },
      { label: 'Cotización', value: 96 },
      { label: 'Administración', value: 93 },
    ],
    tagline:
      'Administra el taller y localiza, cotiza y consigue la refacción precisa para cada diagnóstico.',
  },
] as const;
