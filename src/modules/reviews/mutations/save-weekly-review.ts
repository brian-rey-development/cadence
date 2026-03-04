"use server";

import { db } from "@/db";
import { weeklyReviews } from "@/db/schema/reviews";
import { requireAuth } from "@/modules/auth/utils";

type SaveWeeklyReviewInput = {
  weekStart: string;
  wins: string;
  blockers: string;
  intentions: string;
  aiSuggestions: string;
};

export async function saveWeeklyReview(
  input: SaveWeeklyReviewInput,
): Promise<void> {
  const session = await requireAuth();

  await db.insert(weeklyReviews).values({
    userId: session.user.id,
    weekStart: input.weekStart,
    wins: input.wins,
    blockers: input.blockers,
    intentions: input.intentions,
    aiSuggestions: input.aiSuggestions,
  });
}
