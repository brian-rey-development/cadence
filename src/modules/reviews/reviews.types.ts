import type { DailyReviewModel, WeeklyReviewModel } from "@/db/schema";

export type DailyReview = DailyReviewModel;
export type NewDailyReview = Omit<DailyReviewModel, "id" | "createdAt">;
export type WeeklyReview = WeeklyReviewModel;
export type NewWeeklyReview = Omit<WeeklyReviewModel, "id" | "createdAt">;
