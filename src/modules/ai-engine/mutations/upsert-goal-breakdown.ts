"use server";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { aiGoalBreakdowns } from "@/db/schema/ai-engine";
import type { Milestone } from "../ai-engine.types";

export async function upsertGoalBreakdown(
  userId: string,
  goalId: string,
  milestones: Milestone[],
): Promise<void> {
  await db
    .insert(aiGoalBreakdowns)
    .values({ goalId, userId, milestones, computedAt: new Date() })
    .onConflictDoUpdate({
      target: aiGoalBreakdowns.goalId,
      set: {
        milestones: sql`excluded.milestones`,
        computedAt: sql`excluded.computed_at`,
      },
    });
}
