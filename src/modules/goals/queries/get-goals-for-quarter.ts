import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import type { GoalWithMilestones } from "../goals.types";
import { currentQuarter } from "../utils/goal-utils";

export async function getGoalsForQuarter(
  userId: string,
): Promise<GoalWithMilestones[]> {
  return db.query.goals.findMany({
    where: and(
      eq(goals.userId, userId),
      eq(goals.quarter, currentQuarter()),
      eq(goals.scope, "quarterly"),
    ),
    with: { tasks: true, milestones: true },
    orderBy: (g, { asc }) => [asc(g.area), asc(g.createdAt)],
  });
}
