/**
 * Date utilities
 */

import { format, parse, isValid } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return isValid(d) ? format(d, formatStr) : '';
  } catch {
    return '';
  }
};

export const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHours = h % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
};

export const getNextWeekDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(format(date, 'yyyy-MM-dd'));
  }

  return dates;
};

export const isFutureDate = (date: string): boolean => {
  return new Date(date) > new Date();
};
