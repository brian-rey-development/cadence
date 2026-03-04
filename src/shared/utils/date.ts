export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function today(): string {
  return toISODate(new Date());
}

export function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(b.getTime() - a.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
