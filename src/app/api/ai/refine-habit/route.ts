import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getModel } from "@/modules/ai/client";
import {
  buildPrompt,
  refineHabitSchema,
} from "@/modules/ai/prompts/refine-habit";
import { AREAS } from "@/shared/config/constants";
import { createClient } from "@/shared/lib/supabase/server";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  area: z.enum(AREAS),
  weeklyFrequency: z.number().int().min(1).max(7),
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

  const { name, area, weeklyFrequency } = parsed.data;
  const prompt = buildPrompt({ name, area, weeklyFrequency });

  console.log(
    `[refine-habit] calling AI for habit "${name}" (${area}, ${weeklyFrequency}x/week)`,
  );
  try {
    const result = await generateObject({
      model: getModel(),
      schema: refineHabitSchema,
      prompt,
    });
    console.log(`[refine-habit] AI feedback generated for "${name}"`);
    return NextResponse.json(result.object);
  } catch (err) {
    console.error("[refine-habit] AI call failed:", err);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 },
    );
  }
}
