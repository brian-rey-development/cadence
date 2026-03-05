"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import { requireAuth } from "@/modules/auth/utils";

export async function deleteGoal(goalId: string): Promise<void> {
  const session = await requireAuth();

  await db
    .delete(goals)
    .where(and(eq(goals.id, goalId), eq(goals.userId, session.id)));

  revalidatePath("/goals");
}
