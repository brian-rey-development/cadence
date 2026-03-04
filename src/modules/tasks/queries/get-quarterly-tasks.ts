import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import type { TaskWithGoal } from "../tasks.types";

export async function getQuarterlyTasks(
  userId: string,
): Promise<TaskWithGoal[]> {
  return db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, userId),
      eq(tasks.type, "quarterly"),
      isNull(tasks.date),
    ),
    with: { goal: true },
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });
}
