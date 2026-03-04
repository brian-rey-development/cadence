import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { habitLogs, habits } from "@/db/schema/habits";

type HabitSummary = { total: number; completed: number };

export async function getHabitSummaryToday(
  userId: string,
  date: string,
): Promise<HabitSummary> {
  const [activeHabits, logs] = await Promise.all([
    db
      .select({ id: habits.id })
      .from(habits)
      .where(and(eq(habits.userId, userId), isNull(habits.archivedAt))),
    db
      .select({ id: habitLogs.id })
      .from(habitLogs)
      .where(and(eq(habitLogs.userId, userId), eq(habitLogs.date, date))),
  ]);

  return { total: activeHabits.length, completed: logs.length };
}
