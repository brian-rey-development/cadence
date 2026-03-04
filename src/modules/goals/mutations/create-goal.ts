"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import { requireAuth } from "@/modules/auth/utils";
import { MAX_GOALS_PER_AREA } from "@/shared/config/constants";
import type { NewGoal } from "../goals.types";
import { currentQuarter } from "../utils/goal-utils";

type CreateGoalInput = Omit<NewGoal, "userId" | "quarter" | "status">;

export async function createGoal(data: CreateGoalInput): Promise<void> {
  const session = await requireAuth();
  const userId = session.id;
  const quarter = currentQuarter();

  const [{ value: activeCount }] = await db
    .select({ value: count() })
    .from(goals)
    .where(
      and(
        eq(goals.userId, userId),
        eq(goals.area, data.area),
        eq(goals.quarter, quarter),
        eq(goals.status, "active"),
      ),
    );

  if (activeCount >= MAX_GOALS_PER_AREA) {
    throw new Error(
      `You can have at most ${MAX_GOALS_PER_AREA} active goals per area per quarter.`,
    );
  }

  await db.insert(goals).values({
    title: data.title,
    area: data.area,
    description: data.description,
    userId,
    quarter,
    status: "active",
  });

  revalidatePath("/quarter");
}
