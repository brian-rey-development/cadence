"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { requireAuth } from "@/modules/auth/utils";

export async function archiveTask(taskId: string): Promise<void> {
  const session = await requireAuth();

  await db
    .update(tasks)
    .set({ status: "archived", updatedAt: new Date() })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.id)));

  revalidatePath("/today");
}
