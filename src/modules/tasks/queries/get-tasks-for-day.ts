import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import type { TaskWithGoal } from "../tasks.types";

export type { TaskWithGoal };

export async function getTasksForDay(
  userId: string,
  date: string,
): Promise<TaskWithGoal[]> {
  return db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, userId),
      eq(tasks.date, date),
      eq(tasks.type, "daily"),
    ),
    with: { goal: true, milestone: true },
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });
}
