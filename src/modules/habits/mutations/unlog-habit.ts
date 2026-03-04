"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { habitLogs } from "@/db/schema/habits";
import { requireAuth } from "@/modules/auth/utils";

export async function unlogHabit(habitId: string, date: string): Promise<void> {
  const session = await requireAuth();

  await db
    .delete(habitLogs)
    .where(
      and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.date, date),
        eq(habitLogs.userId, session.user.id),
      ),
    );

  revalidatePath("/habits");
  revalidatePath("/today");
}
