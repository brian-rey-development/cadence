import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getModel } from "@/modules/ai/client";
import { buildUserContext } from "@/modules/ai/utils/build-user-context";
import {
  buildPrompt,
  dailyReviewSchema,
} from "@/modules/ai/prompts/daily-review";
import { getUserSettings } from "@/modules/settings/queries/get-user-settings";
import { createClient } from "@/shared/lib/supabase/server";

const bodySchema = z.object({
  completedTasks: z.array(z.object({ title: z.string(), area: z.string() })),
  reflection: z.string().default(""),
  gratitude: z.string().default(""),
  challenges: z.string().default(""),
  learnings: z.string().default(""),
  tomorrowFocus: z.string().default(""),
  mood: z.enum(["great", "good", "okay", "tough"]),
  date: z.string(),
  weekStats: z
    .object({ completedThisWeek: z.number(), habitsConsistency: z.number() })
    .optional(),
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

  const settings = await getUserSettings(user.id);
  const userContext = settings ? buildUserContext(settings) : null;

  const prompt = buildPrompt({ ...parsed.data, userContext });

  try {
    const result = await generateObject({
      model: getModel(),
      schema: dailyReviewSchema,
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
