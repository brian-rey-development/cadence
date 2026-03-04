import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import type { DailyReviewModel } from "@/db/schema/reviews";
import { dailyReviews } from "@/db/schema/reviews";

export async function getDailyReview(
  userId: string,
  date: string,
): Promise<DailyReviewModel | undefined> {
  return db.query.dailyReviews.findFirst({
    where: and(eq(dailyReviews.userId, userId), eq(dailyReviews.date, date)),
  });
}
