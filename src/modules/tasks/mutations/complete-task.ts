"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { requireAuth } from "@/modules/auth/utils";
import { env } from "@/shared/config/env";

export async function completeTask(taskId: string): Promise<void> {
  const session = await requireAuth();

  await db
    .update(tasks)
    .set({
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.id)));

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
          userId: session.id,
          entityType: "task",
          entityId: taskId,
          content: "completed",
        }),
      }),
      fetch(`${env.appUrl}/api/ai/engine/score-tasks`, {
        method: "POST",
        headers,
        body: JSON.stringify({ userId: session.id }),
      }),
    ]);
  });

  revalidatePath("/today");
}
