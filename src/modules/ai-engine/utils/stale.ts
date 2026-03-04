const MS_PER_HOUR = 1000 * 60 * 60;

export function isStale(computedAt: Date | null, maxAgeHours: number): boolean {
  if (!computedAt) return true;
  return Date.now() - computedAt.getTime() > maxAgeHours * MS_PER_HOUR;
}
