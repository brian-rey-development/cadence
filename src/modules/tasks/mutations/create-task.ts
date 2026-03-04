"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { requireAuth } from "@/modules/auth/utils";
import type { NewTask, TaskWithGoal } from "../tasks.types";

export async function createTask(data: NewTask): Promise<TaskWithGoal> {
  const session = await requireAuth();

  const [inserted] = await db
    .insert(tasks)
    .values({ ...data, userId: session.user.id })
    .returning();

  return { ...inserted, goal: null };
}
