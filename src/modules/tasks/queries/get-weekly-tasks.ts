import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import type { TaskWithGoal } from "../tasks.types";

export async function getWeeklyTasks(
  userId: string,
  weekStartDate: string,
): Promise<TaskWithGoal[]> {
  return db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, userId),
      eq(tasks.weekStart, weekStartDate),
      eq(tasks.type, "weekly"),
    ),
    with: { goal: true, milestone: true },
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });
}
