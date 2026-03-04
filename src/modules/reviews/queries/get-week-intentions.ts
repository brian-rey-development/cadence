import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import type { WeeklyReviewModel } from "@/db/schema/reviews";
import { weeklyReviews } from "@/db/schema/reviews";

export async function getWeekIntentions(
  userId: string,
  weekStartDate: string,
): Promise<WeeklyReviewModel | undefined> {
  return db.query.weeklyReviews.findFirst({
    where: and(
      eq(weeklyReviews.userId, userId),
      eq(weeklyReviews.weekStart, weekStartDate),
    ),
  });
}
