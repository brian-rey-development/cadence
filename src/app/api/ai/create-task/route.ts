import { generateObject } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { aiGoalBreakdowns } from "@/db/schema/ai-engine";
import { getModel } from "@/modules/ai/client";
import {
  buildPrompt,
  createTaskSchema,
} from "@/modules/ai/prompts/create-task";
import { buildUserContext } from "@/modules/ai/utils/build-user-context";
import type { Milestone } from "@/modules/ai-engine/ai-engine.types";
import { getUserSettings } from "@/modules/settings/queries/get-user-settings";
import { getActiveGoals } from "@/modules/tasks/queries/get-active-goals";
import { getTaskCountsForRange } from "@/modules/tasks/queries/get-task-counts-for-range";
import { getTasksForDay } from "@/modules/tasks/queries/get-tasks-for-day";
import { createClient } from "@/shared/lib/supabase/server";
import { today } from "@/shared/utils/date";

const bodySchema = z.object({
  intent: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { intent } = parsed.data;
  const date = today();

  const weekEnd = new Date(date);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekEndISO = weekEnd.toISOString().slice(0, 10);

  const [existingTasks, goals, settings, weekLoad, breakdowns] =
    await Promise.all([
      getTasksForDay(user.id, date),
      getActiveGoals(user.id),
      getUserSettings(user.id),
      getTaskCountsForRange(user.id, date, weekEndISO),
      db
        .select()
        .from(aiGoalBreakdowns)
        .where(eq(aiGoalBreakdowns.userId, user.id)),
    ]);

  const userContext = settings ? buildUserContext(settings) : null;

  const milestones = breakdowns.flatMap((b) =>
    (b.milestones as Milestone[]).map((m) => ({
      goalId: b.goalId,
      targetDate: m.targetDate,
      title: m.title,
    })),
  );

  const prompt = buildPrompt({
    intent,
    existingTaskCount: existingTasks.length,
    goals,
    date,
    userContext,
    weekLoad,
    milestones,
  });

  try {
    const result = await generateObject({
      model: getModel(),
      schema: createTaskSchema,
      prompt,
    });
    return NextResponse.json({ suggestion: result.object, goals });
  } catch {
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 },
    );
  }
}
