"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { milestones } from "@/db/schema/milestones";
import { requireAuth } from "@/modules/auth/utils";

type CreateMilestoneInput = {
  goalId: string;
  title: string;
  targetDate: string;
  sortOrder?: number;
};

export async function createMilestone(
  data: CreateMilestoneInput,
): Promise<void> {
  const session = await requireAuth();

  await db.insert(milestones).values({
    userId: session.id,
    goalId: data.goalId,
    title: data.title,
    targetDate: data.targetDate,
    sortOrder: data.sortOrder ?? 0,
    weekOffset: 0,
    source: "manual",
  });

  revalidatePath("/quarter");
}
