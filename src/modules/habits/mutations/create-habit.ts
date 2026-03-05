"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { habits } from "@/db/schema/habits";
import { requireAuth } from "@/modules/auth/utils";
import type { NewHabit } from "../habits.types";

export async function createHabit(data: NewHabit): Promise<void> {
  const session = await requireAuth();

  await db.insert(habits).values({
    name: data.name,
    area: data.area,
    weeklyFrequency: data.weeklyFrequency,
    scheduledTime: data.scheduledTime ?? null,
    userId: session.id,
  });

  revalidatePath("/habits");
}
