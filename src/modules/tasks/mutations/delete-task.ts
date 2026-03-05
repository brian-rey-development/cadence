"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { requireAuth } from "@/modules/auth/utils";
import { env } from "@/shared/config/env";

export async function deleteTask(taskId: string): Promise<void> {
  const session = await requireAuth();

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.id)));

  after(async () => {
    await fetch(`${env.appUrl}/api/ai/engine/score-tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.cronSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session.id }),
    });
  });

  revalidatePath("/today");
}
