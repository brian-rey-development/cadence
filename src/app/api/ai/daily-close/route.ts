import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { getModel } from "@/modules/ai/client";
import {
  buildPrompt,
  dailyCloseSchema,
} from "@/modules/ai/prompts/daily-close";
import { createClient } from "@/shared/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { completedTitles, reflection, date } = body as {
    completedTitles: string[];
    reflection: string;
    date: string;
  };

  const prompt = buildPrompt({ completedTitles, reflection, date });

  const result = await generateObject({
    model: getModel(),
    schema: dailyCloseSchema,
    prompt,
  });

  return NextResponse.json(result.object);
}
