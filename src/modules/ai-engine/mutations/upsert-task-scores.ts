"use server";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { aiTaskScores } from "@/db/schema/ai-engine";
import type { TaskScore } from "../ai-engine.types";

export async function upsertTaskScores(
  userId: string,
  scores: TaskScore[],
): Promise<void> {
  if (scores.length === 0) return;

  const values = scores.map((s) => ({
    taskId: s.taskId,
    userId,
    impactScore: String(s.impactScore),
    urgencyScore: String(s.urgencyScore),
    opportunityCost: s.opportunityCost,
    reasoning: s.reasoning,
    computedAt: new Date(),
  }));

  await db
    .insert(aiTaskScores)
    .values(values)
    .onConflictDoUpdate({
      target: aiTaskScores.taskId,
      set: {
        impactScore: sql`excluded.impact_score`,
        urgencyScore: sql`excluded.urgency_score`,
        opportunityCost: sql`excluded.opportunity_cost`,
        reasoning: sql`excluded.reasoning`,
        computedAt: sql`excluded.computed_at`,
      },
    });
}
