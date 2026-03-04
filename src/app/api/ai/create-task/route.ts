import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getModel } from "@/modules/ai/client";
import {
  buildPrompt,
  createTaskSchema,
} from "@/modules/ai/prompts/create-task";
import { getActiveGoals } from "@/modules/tasks/queries/get-active-goals";
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
  const [existingTasks, goals] = await Promise.all([
    getTasksForDay(user.id, date),
    getActiveGoals(user.id),
  ]);

  const prompt = buildPrompt({
    intent,
    existingTaskCount: existingTasks.length,
    goals,
    date,
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
