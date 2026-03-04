import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { habitLogs } from "@/db/schema/habits";
import { tasks } from "@/db/schema/tasks";
import { AREAS } from "@/shared/config/constants";
import { weekEnd } from "@/shared/utils/week";

export type WeeklyStats = {
  tasksByArea: Record<string, { completed: number; total: number }>;
  zombieCount: number;
  habitConsistency: number;
};

export async function getWeeklyStats(
  userId: string,
  weekStartDate: string,
): Promise<WeeklyStats> {
  const weekEndDate = weekEnd(new Date(weekStartDate));

  const [weekTasks, logs] = await Promise.all([
    db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.date, weekStartDate),
          lte(tasks.date, weekEndDate),
        ),
      ),
    db
      .select()
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.userId, userId),
          gte(habitLogs.date, weekStartDate),
          lte(habitLogs.date, weekEndDate),
        ),
      ),
  ]);

  const tasksByArea = Object.fromEntries(
    AREAS.map((area) => {
      const areaItems = weekTasks.filter((t) => t.area === area);
      return [
        area,
        {
          completed: areaItems.filter((t) => t.status === "completed").length,
          total: areaItems.length,
        },
      ];
    }),
  );

  const daysInWeek = 7;
  const habitConsistency =
    logs.length > 0
      ? Math.min(Math.round((logs.length / daysInWeek) * 100), 100)
      : 0;

  const zombieCount = weekTasks.filter((t) => t.postponeCount >= 2).length;

  return { tasksByArea, zombieCount, habitConsistency };
}
