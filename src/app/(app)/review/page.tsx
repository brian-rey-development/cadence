import { requireAuth } from "@/modules/auth/utils";
import DailyJournalHistory from "@/modules/reviews/components/daily-journal-history";
import WeeklyReviewHistory from "@/modules/reviews/components/weekly-review-history";
import { getDailyReviews } from "@/modules/reviews/queries/get-daily-reviews";
import { getPastReviews } from "@/modules/reviews/queries/get-past-reviews";

export default async function ReviewPage() {
  const user = await requireAuth();
  const [weeklyReviews, dailyJournals] = await Promise.all([
    getPastReviews(user.id),
    getDailyReviews(user.id),
  ]);

  return (
    <div className="flex flex-col gap-8 px-4 py-6 max-w-lg mx-auto">
      <header>
        <h1 className="font-display text-3xl text-text-primary">Reviews</h1>
      </header>

      <DailyJournalHistory journals={dailyJournals} />
      <WeeklyReviewHistory reviews={weeklyReviews} />
    </div>
  );
}
