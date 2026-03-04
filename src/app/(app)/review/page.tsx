import { requireAuth } from "@/modules/auth/utils";
import { getPastReviews } from "@/modules/reviews/queries/get-past-reviews";
import EmptyState from "@/shared/components/common/empty-state";

function formatWeekLabel(weekStartStr: string): string {
  const date = new Date(`${weekStartStr}T00:00:00`);
  return `Week of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default async function ReviewPage() {
  const user = await requireAuth();
  const reviews = await getPastReviews(user.id);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <header>
        <h1
          className="font-['Fraunces'] text-2xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Reviews
        </h1>
      </header>

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Complete your first weekly review to see your history here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-3 px-4 py-4"
              style={{
                backgroundColor: "var(--color-bg-surface)",
                borderLeft: "1px solid var(--color-border-subtle)",
                borderRadius: 12,
              }}
            >
              <span
                className="text-[13px] font-medium font-['DM_Sans']"
                style={{ color: "var(--color-text-primary)" }}
              >
                {formatWeekLabel(review.weekStart)}
              </span>

              {review.wins && (
                <div className="flex flex-col gap-1">
                  <span
                    className="text-[11px] font-medium font-['DM_Sans'] uppercase tracking-widest"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Wins
                  </span>
                  <p
                    className="text-[13px] font-['DM_Sans'] leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {review.wins}
                  </p>
                </div>
              )}

              {review.blockers && (
                <div className="flex flex-col gap-1">
                  <span
                    className="text-[11px] font-medium font-['DM_Sans'] uppercase tracking-widest"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Blockers
                  </span>
                  <p
                    className="text-[13px] font-['DM_Sans'] leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {review.blockers}
                  </p>
                </div>
              )}

              {review.aiSuggestions && (
                <div className="flex flex-col gap-1">
                  <span
                    className="text-[11px] font-medium font-['DM_Sans'] uppercase tracking-widest"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    AI Suggestions
                  </span>
                  <p
                    className="text-[13px] font-['DM_Sans'] leading-relaxed"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {review.aiSuggestions}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
