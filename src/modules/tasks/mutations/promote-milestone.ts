"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { requireAuth } from "@/modules/auth/utils";

type PromoteMilestoneInput = {
  title: string;
  area: "work" | "personal" | "identity";
  goalId: string;
};

export async function promoteMilestone({
  title,
  area,
  goalId,
}: PromoteMilestoneInput): Promise<string> {
  const session = await requireAuth();
  const userId = session.id;

  const [task] = await db
    .insert(tasks)
    .values({
      userId,
      title,
      area,
      type: "quarterly",
      date: null,
      goalId,
    })
    .returning({ id: tasks.id });

  return task.id;
}
