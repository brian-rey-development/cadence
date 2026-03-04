"use server";

import { after } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { requireAuth } from "@/modules/auth/utils";
import { env } from "@/shared/config/env";
import type { NewTask, TaskWithGoal } from "../tasks.types";

function triggerEngineRoutes(
  userId: string,
  entityId: string,
  content: string,
): void {
  const headers = {
    Authorization: `Bearer ${env.cronSecret}`,
    "Content-Type": "application/json",
  };
  after(async () => {
    await Promise.allSettled([
      fetch(`${env.appUrl}/api/ai/engine/embed`, {
        method: "POST",
        headers,
        body: JSON.stringify({ userId, entityType: "task", entityId, content }),
      }),
      fetch(`${env.appUrl}/api/ai/engine/score-tasks`, {
        method: "POST",
        headers,
        body: JSON.stringify({ userId }),
      }),
    ]);
  });
}

export async function createTask(data: NewTask): Promise<TaskWithGoal> {
  const session = await requireAuth();

  const [inserted] = await db
    .insert(tasks)
    .values({ ...data, userId: session.id })
    .returning();

  triggerEngineRoutes(session.id, inserted.id, inserted.title);

  return { ...inserted, goal: null };
}
