import { and, between, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";

export type DayLoad = {
  date: string;
  taskCount: number;
};

export async function getTaskCountsForRange(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<DayLoad[]> {
  const rows = await db
    .select({
      date: tasks.date,
      count: sql<number>`count(*)::int`,
    })
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.type, "daily"),
        between(tasks.date, startDate, endDate),
      ),
    )
    .groupBy(tasks.date);

  return rows.map((r) => ({ date: r.date as string, taskCount: r.count }));
}
