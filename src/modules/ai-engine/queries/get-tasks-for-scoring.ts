import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import { tasks } from "@/db/schema/tasks";

export type TaskForScoring = {
  id: string;
  title: string;
  area: string;
  date: string;
  postponeCount: number;
  goalId: string | null;
  goalTitle: string | null;
};

export async function getTasksForScoring(
  userId: string,
): Promise<TaskForScoring[]> {
  const rows = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      area: tasks.area,
      date: tasks.date,
      postponeCount: tasks.postponeCount,
      goalId: tasks.goalId,
      goalTitle: goals.title,
    })
    .from(tasks)
    .leftJoin(goals, and(eq(tasks.goalId, goals.id), eq(goals.userId, userId)))
    .where(and(eq(tasks.userId, userId), inArray(tasks.status, ["pending"])));

  return rows.map((r) => ({
    ...r,
    goalTitle: r.goalTitle ?? null,
  }));
}
