import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { milestones } from "@/db/schema/milestones";

type AiMilestoneInput = {
  title: string;
  targetDate: string;
  weekOffset: number;
};

export async function syncAiMilestonesToDb(
  userId: string,
  goalId: string,
  aiMilestones: AiMilestoneInput[],
): Promise<void> {
  await db
    .delete(milestones)
    .where(
      and(
        eq(milestones.userId, userId),
        eq(milestones.goalId, goalId),
        eq(milestones.source, "ai"),
      ),
    );

  if (aiMilestones.length === 0) return;

  await db.insert(milestones).values(
    aiMilestones.map((m, index) => ({
      userId,
      goalId,
      title: m.title,
      targetDate: m.targetDate,
      weekOffset: m.weekOffset,
      sortOrder: index,
      source: "ai" as const,
    })),
  );
}
