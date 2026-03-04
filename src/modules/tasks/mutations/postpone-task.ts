"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { requireAuth } from "@/modules/auth/utils";
import { env } from "@/shared/config/env";

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
