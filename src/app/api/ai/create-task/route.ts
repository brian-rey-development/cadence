import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { getModel } from "@/modules/ai/client";
import {
  buildPrompt,
  createTaskSchema,
} from "@/modules/ai/prompts/create-task";
import { getActiveGoals } from "@/modules/tasks/queries/get-active-goals";
import { getTasksForDay } from "@/modules/tasks/queries/get-tasks-for-day";
import { createClient } from "@/shared/lib/supabase/server";
import { today } from "@/shared/utils/date";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const intent = typeof body.intent === "string" ? body.intent.trim() : "";

  if (!intent) {
    return NextResponse.json({ error: "Intent is required" }, { status: 400 });
  }

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

  const result = await generateObject({
    model: getModel(),
    schema: createTaskSchema,
    prompt,
  });

  return NextResponse.json({ suggestion: result.object, goals });
}
