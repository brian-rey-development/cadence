import { toISODate } from "@/shared/utils/date";
import type { HabitLog } from "../habits.types";

function buildDateSet(logs: HabitLog[]): Set<string> {
  return new Set(logs.map((l) => l.date));
}

function shiftDay(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

export function currentStreak(logs: HabitLog[]): number {
  const logged = buildDateSet(logs);
  const todayStr = toISODate(new Date());
  let streak = 0;
  let cursor = todayStr;

  while (logged.has(cursor)) {
    streak++;
    cursor = shiftDay(cursor, -1);
  }

  return streak;
}

export function longestStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;

  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  let best = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i++) {
    const expected = shiftDay(sorted[i - 1].date, 1);
    if (sorted[i].date === expected) {
      run++;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }

  return best;
}
