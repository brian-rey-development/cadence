"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { requireAuth } from "@/modules/auth/utils";

type PostponeTaskInput = {
  taskId: string;
  toDate: string;
};

export async function postponeTask({
  taskId,
  toDate,
}: PostponeTaskInput): Promise<void> {
  const session = await requireAuth();

  await db
    .update(tasks)
    .set({
      date: toDate,
      postponeCount: sql`${tasks.postponeCount} + 1`,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));

  revalidatePath("/today");
}
