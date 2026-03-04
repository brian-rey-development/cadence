import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { getModel } from "@/modules/ai/client";
import {
  buildPrompt,
  zombieCheckSchema,
} from "@/modules/ai/prompts/zombie-check";
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
  const prompt = buildPrompt(body);

  const result = await generateObject({
    model: getModel(),
    schema: zombieCheckSchema,
    prompt,
  });

  return NextResponse.json(result.object);
}
