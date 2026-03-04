"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { dailyReviews } from "@/db/schema/reviews";
import { requireAuth } from "@/modules/auth/utils";

type SaveDailyReviewInput = {
  date: string;
  reflection: string;
  gratitude: string;
  challenges: string;
  learnings: string;
  tomorrowFocus: string;
  mood: "great" | "good" | "okay" | "tough";
  aiSummary: string;
  aiFeedback: string;
  aiInsights: string[];
  aiNextDayFocus: string;
};

export async function saveDailyReview(
  input: SaveDailyReviewInput,
): Promise<void> {
  const session = await requireAuth();
  const userId = session.id;

  const existing = await db.query.dailyReviews.findFirst({
    where: and(
      eq(dailyReviews.userId, userId),
      eq(dailyReviews.date, input.date),
    ),
  });

  if (existing) return;

  await db.insert(dailyReviews).values({ userId, ...input });
}
