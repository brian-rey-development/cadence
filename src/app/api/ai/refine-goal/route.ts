import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getModel } from "@/modules/ai/client";
import {
  buildPrompt,
  goalRefineSchema,
} from "@/modules/ai/prompts/goal-refine";
import { currentQuarter } from "@/modules/goals/utils/goal-utils";
import { AREAS } from "@/shared/config/constants";
import { createClient } from "@/shared/lib/supabase/server";

const bodySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).nullable(),
  area: z.enum(AREAS),
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

  const { title, description, area } = parsed.data;
  const quarter = currentQuarter();
  const prompt = buildPrompt({ title, description, area, quarter });

  try {
    const result = await generateObject({
      model: getModel(),
      schema: goalRefineSchema,
      prompt,
    });
    return NextResponse.json(result.object);
  } catch {
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 },
    );
  }
}
