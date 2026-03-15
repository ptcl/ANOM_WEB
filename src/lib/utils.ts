import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Vérifie si un cache est encore valide
 * @param lastFetch - Timestamp du dernier fetch (null = jamais fetché)
 * @param duration - Durée de validité en ms
 */
export function isCached(lastFetch: number | null, duration: number): boolean {
  return !!lastFetch && Date.now() - lastFetch < duration
}

export function formatAgentDate(date: string | Date | undefined | null): string {
  if (!date) return 'UNKNOWN';
  let d: Date | null = null;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === 'string') {
    const parsed = new Date(date);
    d = isNaN(parsed.getTime()) ? null : parsed;
  }
  if (!d) return typeof date === 'string' ? date : 'UNKNOWN';

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  return `${year}-${month}-${day}`;
}

