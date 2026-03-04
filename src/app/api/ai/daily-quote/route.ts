import { generateObject } from "ai";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { aiDailyQuotes } from "@/db/schema/ai-engine";
import { dailyReviews } from "@/db/schema/reviews";
import { getQuoteModel } from "@/modules/ai/client";
import {
  buildPrompt,
  dailyQuoteSchema,
} from "@/modules/ai/prompts/daily-quote";
import { buildUserContext } from "@/modules/ai/utils/build-user-context";
import { getUserSettings } from "@/modules/settings/queries/get-user-settings";
import { getActiveGoals } from "@/modules/tasks/queries/get-active-goals";
import { createClient } from "@/shared/lib/supabase/server";
import { today } from "@/shared/utils/date";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const date = today();

  const cached = await db.query.aiDailyQuotes.findFirst({
    where: and(eq(aiDailyQuotes.userId, user.id), eq(aiDailyQuotes.date, date)),
  });

  if (cached) {
    return NextResponse.json({
      quote: cached.quote,
      theme: cached.theme,
      date: cached.date,
      cached: true,
    });
  }

  const [goals, settings, recentReviews] = await Promise.all([
    getActiveGoals(user.id),
    getUserSettings(user.id),
    db
      .select({ mood: dailyReviews.mood })
      .from(dailyReviews)
      .where(eq(dailyReviews.userId, user.id))
      .orderBy(desc(dailyReviews.date))
      .limit(3),
  ]);

  const userContext = settings ? buildUserContext(settings) : null;
  const recentMoods = recentReviews
    .map((r) => r.mood)
    .filter((m): m is NonNullable<typeof m> => m != null);

  const prompt = buildPrompt({
    date,
    goals: goals.map((g) => ({ title: g.title, area: g.area })),
    recentMoods,
    userContext,
  });

  try {
    const result = await generateObject({
      model: getQuoteModel(),
      schema: dailyQuoteSchema,
      prompt,
    });

    const { quote, theme } = result.object;

    await db
      .insert(aiDailyQuotes)
      .values({ userId: user.id, date, quote, theme })
      .onConflictDoNothing();

    return NextResponse.json({ quote, theme, date, cached: false });
  } catch {
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 },
    );
  }
}
