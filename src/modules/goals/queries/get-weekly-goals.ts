import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import type { GoalWithTasksAndParent } from "../goals.types";

export async function getWeeklyGoals(
  userId: string,
  weekStart: string,
): Promise<GoalWithTasksAndParent[]> {
  return db.query.goals.findMany({
    where: and(
      eq(goals.userId, userId),
      eq(goals.scope, "weekly"),
      eq(goals.weekStart, weekStart),
      eq(goals.status, "active"),
    ),
    with: { tasks: true, parentGoal: true },
    orderBy: (g, { asc }) => [asc(g.area), asc(g.createdAt)],
  });
}
