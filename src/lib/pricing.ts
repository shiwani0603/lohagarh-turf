export const DAY_SLOTS = [
  '05:00','06:00','07:00','08:00','09:00','10:00',
  '11:00','12:00','13:00','14:00','15:00','16:00',
];

export const NIGHT_SLOTS = [
  '18:00','19:00','20:00','21:00','22:00','23:00',
];

export type SlotType = 'day' | 'night';
export type DayType = 'weekday' | 'weekend';

export function getDayType(date: Date): DayType {
  const day = date.getDay();
  return day === 0 || day === 6 ? 'weekend' : 'weekday';
}

export function getSlotType(startTime: string): SlotType {
  const hour = parseInt(startTime.split(':')[0]);
  return hour >= 18 ? 'night' : 'day';
}

export function getPricePerHour(slotType: SlotType, dayType: DayType): number {
  if (slotType === 'day' && dayType === 'weekday') return 599;
  if (slotType === 'night' && dayType === 'weekday') return 699;
  if (slotType === 'day' && dayType === 'weekend') return 699;
  return 799; // night + weekend
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

export function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const newH = h + hours;
  return `${newH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function getMaxDuration(startTime: string, slotType: SlotType): number {
  const hour = parseInt(startTime.split(':')[0]);
  if (slotType === 'day') return 17 - hour;   // day ends at 17:00
  return 24 - hour;                            // night ends at 24:00
}

export const SPORTS = ['Football', 'Box Cricket', 'Frisbee', 'Any Turf Game'];

export const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+917793014321';
