"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { requireAuth } from "@/modules/auth/utils";
import { env } from "@/shared/config/env";

export async function archiveTask(taskId: string): Promise<void> {
  const session = await requireAuth();

  await db
    .update(tasks)
    .set({ status: "archived", updatedAt: new Date() })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.id)));

  const headers = {
    Authorization: `Bearer ${env.cronSecret}`,
    "Content-Type": "application/json",
  };
  after(async () => {
    await fetch(`${env.appUrl}/api/ai/engine/score-tasks`, {
      method: "POST",
      headers,
      body: JSON.stringify({ userId: session.id }),
    });
  });

  revalidatePath("/today");
}
