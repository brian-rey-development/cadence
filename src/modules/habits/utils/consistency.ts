import { HABIT_CONSISTENCY_DAYS } from "@/shared/config/constants";
import { toISODate } from "@/shared/utils/date";
import type { HabitWithLogs } from "../habits.types";

function getWindowStart(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - (days - 1));
  return toISODate(d);
}

export function weeklyConsistency(habits: HabitWithLogs[]): number {
  if (habits.length === 0) return 0;

  const windowStart = getWindowStart(HABIT_CONSISTENCY_DAYS);

  let totalExpected = 0;
  let totalActual = 0;

  for (const habit of habits) {
    const logsInWindow = habit.logs.filter((l) => l.date >= windowStart).length;
    totalExpected += habit.weeklyFrequency;
    totalActual += Math.min(logsInWindow, habit.weeklyFrequency);
  }

  if (totalExpected === 0) return 0;
  return Math.round((totalActual / totalExpected) * 100);
}
