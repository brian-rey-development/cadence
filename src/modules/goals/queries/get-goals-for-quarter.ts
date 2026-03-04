import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import type { GoalWithTasks } from "../goals.types";
import { currentQuarter } from "../utils/goal-utils";

export async function getGoalsForQuarter(
  userId: string,
): Promise<GoalWithTasks[]> {
  return db.query.goals.findMany({
    where: and(eq(goals.userId, userId), eq(goals.quarter, currentQuarter())),
    with: { tasks: true },
    orderBy: (g, { asc }) => [asc(g.area), asc(g.createdAt)],
  });
}
