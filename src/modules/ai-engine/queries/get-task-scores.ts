import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { aiTaskScores } from "@/db/schema/ai-engine";
import type { AiTaskScore } from "../ai-engine.types";

export async function getTaskScores(
  userId: string,
  taskIds: string[],
): Promise<AiTaskScore[]> {
  if (taskIds.length === 0) return [];

  return db
    .select()
    .from(aiTaskScores)
    .where(
      and(
        eq(aiTaskScores.userId, userId),
        inArray(aiTaskScores.taskId, taskIds),
      ),
    );
}
