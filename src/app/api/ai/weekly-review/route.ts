import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { getModel } from "@/modules/ai/client";
import {
  buildPrompt,
  weeklyReviewSchema,
} from "@/modules/ai/prompts/weekly-review";
import { requireAuth } from "@/modules/auth/utils";

export async function POST(req: Request) {
  const session = await requireAuth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { wins, blockers, goals, stats } = body;

  const prompt = buildPrompt({ wins, blockers, goals, stats });

  const result = await generateObject({
    model: getModel(),
    schema: weeklyReviewSchema,
    prompt,
  });

  return NextResponse.json(result.object);
}
