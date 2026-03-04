import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { weeklyReviews } from "@/db/schema/reviews";

export async function getPastReviews(userId: string) {
  return db
    .select()
    .from(weeklyReviews)
    .where(eq(weeklyReviews.userId, userId))
    .orderBy(desc(weeklyReviews.weekStart))
    .limit(20);
}
