/** Horario del taller en Hermosillo (sin horario de verano). */
export const WORKSHOP_TIMEZONE = 'America/Hermosillo';

type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function getHermosilloDayAndMinutes(date: Date): { day: DayIndex; minutes: number } {
  const weekdayStr = new Intl.DateTimeFormat('en-US', {
    timeZone: WORKSHOP_TIMEZONE,
    weekday: 'short',
  }).format(date);

  const dayMap: Record<string, DayIndex> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const day = dayMap[weekdayStr] ?? 0;

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: WORKSHOP_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const hour = parseInt(parts.find((p) => p.type === 'hour')!.value, 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')!.value, 10);

  return { day, minutes: hour * 60 + minute };
}

/** Lun–vie: 8:30–12:50 y 14:30–18:50. Sáb: 9:00–13:00. Dom: cerrado. */
export function isWorkshopOpen(date: Date = new Date()): boolean {
  const { day, minutes: m } = getHermosilloDayAndMinutes(date);

  if (day === 0) return false;

  if (day >= 1 && day <= 5) {
    const morning = m >= 8 * 60 + 30 && m <= 12 * 60 + 50;
    const afternoon = m >= 14 * 60 + 30 && m <= 18 * 60 + 50;
    return morning || afternoon;
  }

  if (day === 6) {
    return m >= 9 * 60 && m < 13 * 60;
  }

  return false;
}

export function getWorkshopStatus(date: Date = new Date()) {
  const open = isWorkshopOpen(date);
  return {
    open,
    label: open ? 'Taller abierto' : 'Taller cerrado',
    dotClass: open
      ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]'
      : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.45)]',
  } as const;
}
