"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { habits } from "@/db/schema/habits";
import { requireAuth } from "@/modules/auth/utils";

export async function deleteHabit(habitId: string): Promise<void> {
  const session = await requireAuth();

  await db
    .delete(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, session.id)));

  revalidatePath("/today");
  revalidatePath("/habits");
}
