"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { aiGoalBreakdowns } from "@/db/schema/ai-engine";
import type { AiGoalBreakdown } from "../ai-engine.types";

export async function getGoalBreakdown(
  userId: string,
  goalId: string,
): Promise<AiGoalBreakdown | null> {
  const [row] = await db
    .select()
    .from(aiGoalBreakdowns)
    .where(
      and(
        eq(aiGoalBreakdowns.goalId, goalId),
        eq(aiGoalBreakdowns.userId, userId),
      ),
    );

  return row ?? null;
}
