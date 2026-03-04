"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { dailyReviews } from "@/db/schema/reviews";
import { requireAuth } from "@/modules/auth/utils";

type SaveDailyReviewInput = {
  date: string;
  reflection: string;
  aiSummary: string;
};

export async function saveDailyReview({
  date,
  reflection,
  aiSummary,
}: SaveDailyReviewInput): Promise<void> {
  const session = await requireAuth();
  const userId = session.id;

  const existing = await db.query.dailyReviews.findFirst({
    where: and(eq(dailyReviews.userId, userId), eq(dailyReviews.date, date)),
  });

  if (existing) return;

  await db.insert(dailyReviews).values({ userId, date, reflection, aiSummary });
}
