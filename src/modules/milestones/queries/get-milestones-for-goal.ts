import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { milestones } from "@/db/schema/milestones";
import type { Milestone } from "../milestones.types";

export async function getMilestonesForGoal(
  userId: string,
  goalId: string,
): Promise<Milestone[]> {
  return db.query.milestones.findMany({
    where: and(eq(milestones.userId, userId), eq(milestones.goalId, goalId)),
    orderBy: [asc(milestones.sortOrder), asc(milestones.createdAt)],
  });
}
