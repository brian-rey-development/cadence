"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import { requireAuth } from "@/modules/auth/utils";
import { getUserSettings } from "@/modules/settings/queries/get-user-settings";
import { MAX_GOALS_PER_AREA } from "@/shared/config/constants";
import { env } from "@/shared/config/env";
import { currentQuarter } from "../utils/goal-utils";

type CreateGoalInput = {
  title: string;
  area: "work" | "personal" | "identity";
  description?: string | null;
  scope: "quarterly" | "weekly";
  weekStart?: string | null;
  parentGoalId?: string | null;
};

function quarterFromWeekStart(weekStartDate: string): string {
  const date = new Date(`${weekStartDate}T00:00:00`);
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `${date.getFullYear()}-Q${quarter}`;
}

export async function createGoal(data: CreateGoalInput): Promise<void> {
  const session = await requireAuth();
  const userId = session.id;

  const isWeekly = data.scope === "weekly";
  const quarter = isWeekly
    ? quarterFromWeekStart(data.weekStart ?? "")
    : currentQuarter();

  const limitWhere = isWeekly
    ? and(
        eq(goals.userId, userId),
        eq(goals.area, data.area),
        eq(goals.scope, "weekly"),
        eq(goals.weekStart, data.weekStart ?? ""),
        eq(goals.status, "active"),
      )
    : and(
        eq(goals.userId, userId),
        eq(goals.area, data.area),
        eq(goals.scope, "quarterly"),
        eq(goals.quarter, quarter),
        eq(goals.status, "active"),
      );

  const [[{ value: activeCount }], settings] = await Promise.all([
    db.select({ value: count() }).from(goals).where(limitWhere),
    getUserSettings(userId),
  ]);

  const limit = isWeekly
    ? (settings?.weeklyGoalLimit ?? MAX_GOALS_PER_AREA)
    : MAX_GOALS_PER_AREA;

  if (activeCount >= limit) {
    throw new Error(
      `You can have at most ${limit} active ${isWeekly ? "weekly" : "quarterly"} goals per area.`,
    );
  }

  const [inserted] = await db
    .insert(goals)
    .values({
      title: data.title,
      area: data.area,
      description: data.description,
      userId,
      quarter,
      scope: data.scope,
      weekStart: isWeekly ? data.weekStart : null,
      parentGoalId: data.parentGoalId ?? null,
      status: "active",
    })
    .returning();

  const headers = {
    Authorization: `Bearer ${env.cronSecret}`,
    "Content-Type": "application/json",
  };

  after(async () => {
    const base = [
      fetch(`${env.appUrl}/api/ai/engine/embed`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId,
          entityType: "goal",
          entityId: inserted.id,
          content: inserted.title,
        }),
      }),
      fetch(`${env.appUrl}/api/ai/engine/score-tasks`, {
        method: "POST",
        headers,
        body: JSON.stringify({ userId }),
      }),
    ];

    const withBreakdown = isWeekly
      ? base
      : [
          ...base,
          fetch(`${env.appUrl}/api/ai/engine/goal-breakdown`, {
            method: "POST",
            headers,
            body: JSON.stringify({ userId, goalId: inserted.id }),
          }),
        ];

    await Promise.allSettled(withBreakdown);
  });

  revalidatePath("/quarter");
  if (isWeekly) revalidatePath("/week");
}
