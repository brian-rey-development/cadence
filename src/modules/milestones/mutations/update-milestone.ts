"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { milestones } from "@/db/schema/milestones";
import { requireAuth } from "@/modules/auth/utils";

type UpdateMilestoneInput = {
  id: string;
  title?: string;
  targetDate?: string;
  sortOrder?: number;
};

export async function updateMilestone(
  data: UpdateMilestoneInput,
): Promise<void> {
  const session = await requireAuth();

  await db
    .update(milestones)
    .set({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.targetDate !== undefined && { targetDate: data.targetDate }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      updatedAt: new Date(),
    })
    .where(and(eq(milestones.id, data.id), eq(milestones.userId, session.id)));

  revalidatePath("/quarter");
}
