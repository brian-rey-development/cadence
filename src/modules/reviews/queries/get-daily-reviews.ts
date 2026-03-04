import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { dailyReviews } from "@/db/schema/reviews";

export async function getDailyReviews(userId: string) {
  return db
    .select()
    .from(dailyReviews)
    .where(eq(dailyReviews.userId, userId))
    .orderBy(desc(dailyReviews.date))
    .limit(30);
}
