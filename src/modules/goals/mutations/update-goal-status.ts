"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import { requireAuth } from "@/modules/auth/utils";
import { env } from "@/shared/config/env";

export async function updateGoalStatus(
  goalId: string,
  status: "achieved" | "abandoned",
): Promise<void> {
  const session = await requireAuth();
  const userId = session.id;

  const [updated] = await db
    .update(goals)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
    .returning({ title: goals.title });

  if (!updated) {
    revalidatePath("/quarter");
    return;
  }

  const headers = {
    Authorization: `Bearer ${env.cronSecret}`,
    "Content-Type": "application/json",
  };
  after(async () => {
    await Promise.allSettled([
      fetch(`${env.appUrl}/api/ai/engine/embed`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId,
          entityType: "goal",
          entityId: goalId,
          content: `${updated.title} (${status})`,
        }),
      }),
      fetch(`${env.appUrl}/api/ai/engine/goal-breakdown`, {
        method: "POST",
        headers,
        body: JSON.stringify({ userId, goalId }),
      }),
    ]);
  });

  revalidatePath("/quarter");
}
