"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { milestones } from "@/db/schema/milestones";
import { requireAuth } from "@/modules/auth/utils";

export async function deleteMilestone(id: string): Promise<void> {
  const session = await requireAuth();

  await db
    .delete(milestones)
    .where(and(eq(milestones.id, id), eq(milestones.userId, session.id)));

  revalidatePath("/quarter");
}
