// src/utils/dateHelper.ts
import { parseISO, getISOWeek, getYear, startOfISOWeek, endOfISOWeek, format } from 'date-fns';

export const getWeek = (dateStr: string): string => {
  const date = parseISO(dateStr);
  const week = getISOWeek(date);
  const year = getYear(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

export const getWeekRange = (dateStr: string): { from: string; to: string } => {
  const date = parseISO(dateStr);
  const from = format(startOfISOWeek(date), 'MMM d');
  const to = format(endOfISOWeek(date), 'MMM d');
  return { from, to };
};
