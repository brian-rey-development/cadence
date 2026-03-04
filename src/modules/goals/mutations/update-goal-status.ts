"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import { requireAuth } from "@/modules/auth/utils";

export async function updateGoalStatus(
  goalId: string,
  status: "achieved" | "abandoned",
): Promise<void> {
  const session = await requireAuth();

  await db
    .update(goals)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(goals.id, goalId), eq(goals.userId, session.user.id)));

  revalidatePath("/quarter");
}
