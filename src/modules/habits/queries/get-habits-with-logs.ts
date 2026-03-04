import { and, asc, eq, gte, isNull } from "drizzle-orm";
import { db } from "@/db";
import { habitLogs, habits } from "@/db/schema/habits";
import type { HabitWithLogs } from "../habits.types";

export async function getHabitsWithLogs(
  userId: string,
  startDate: string,
): Promise<HabitWithLogs[]> {
  return db.query.habits.findMany({
    where: and(eq(habits.userId, userId), isNull(habits.archivedAt)),
    with: {
      logs: {
        where: gte(habitLogs.date, startDate),
      },
    },
    orderBy: asc(habits.createdAt),
  });
}
