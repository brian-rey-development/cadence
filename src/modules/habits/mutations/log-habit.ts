"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { habitLogs } from "@/db/schema/habits";
import { requireAuth } from "@/modules/auth/utils";

export async function logHabit(habitId: string, date: string): Promise<void> {
  const session = await requireAuth();

  await db.insert(habitLogs).values({
    habitId,
    date,
    userId: session.id,
  });

  revalidatePath("/habits");
  revalidatePath("/today");
}
