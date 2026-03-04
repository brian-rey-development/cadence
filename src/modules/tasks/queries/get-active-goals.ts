import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import type { GoalModel } from "@/db/schema/goals";
import { goals } from "@/db/schema/goals";

function currentQuarter(): string {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${quarter}`;
}

export async function getActiveGoals(userId: string): Promise<GoalModel[]> {
  return db.query.goals.findMany({
    where: and(
      eq(goals.userId, userId),
      eq(goals.status, "active"),
      eq(goals.quarter, currentQuarter()),
    ),
    orderBy: (g, { asc }) => [asc(g.area), asc(g.createdAt)],
  });
}
