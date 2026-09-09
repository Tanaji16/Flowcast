import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCapacity(current: number, max: number): string {
  const percentage = Math.round((current / max) * 100);
  return `${percentage}%`;
}

export function getStatusColor(percentage: number): 'green' | 'yellow' | 'red' {
  if (percentage < 60) return 'green';
  if (percentage < 85) return 'yellow';
  return 'red';
}
