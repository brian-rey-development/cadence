import { and, eq, or } from "drizzle-orm";
import { db } from "@/db";
import type { GoalModel } from "@/db/schema/goals";
import { goals } from "@/db/schema/goals";
import { weekStart } from "@/shared/utils/week";

function currentQuarter(): string {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${quarter}`;
}

export async function getActiveGoals(userId: string): Promise<GoalModel[]> {
  const currentWeekStart = weekStart();

  return db.query.goals.findMany({
    where: and(
      eq(goals.userId, userId),
      eq(goals.status, "active"),
      or(
        and(eq(goals.scope, "quarterly"), eq(goals.quarter, currentQuarter())),
        and(eq(goals.scope, "weekly"), eq(goals.weekStart, currentWeekStart)),
      ),
    ),
    orderBy: (g, { asc }) => [asc(g.scope), asc(g.area), asc(g.createdAt)],
  });
}
