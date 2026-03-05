import type { WeeklyReviewModel } from "@/db/schema/reviews";
import EmptyState from "@/shared/components/common/empty-state";

type WeeklyReviewHistoryProps = {
  reviews: WeeklyReviewModel[];
};

function formatWeekLabel(weekStartStr: string): string {
  const date = new Date(`${weekStartStr}T00:00:00`);
  return `Week of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default function WeeklyReviewHistory({
  reviews,
}: WeeklyReviewHistoryProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-widest font-body text-text-tertiary">
        Weekly Reviews
      </p>

      {reviews.length === 0 ? (
        <EmptyState
          title="No weekly reviews yet"
          description="Complete your first weekly review to see it here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-3 px-4 py-4 rounded-2xl bg-bg-elevated"
            >
              <span className="text-sm font-medium font-body text-text-primary">
                {formatWeekLabel(review.weekStart)}
              </span>

              {review.wins && <ReviewField label="Wins" value={review.wins} />}
              {review.blockers && (
                <ReviewField label="Blockers" value={review.blockers} />
              )}
              {review.aiSuggestions && (
                <ReviewField
                  label="AI Suggestions"
                  value={review.aiSuggestions}
                  muted
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewField({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium font-body uppercase tracking-widest text-text-tertiary">
        {label}
      </span>
      <p
        className="text-sm font-body leading-relaxed"
        style={{
          color: muted
            ? "var(--color-text-tertiary)"
            : "var(--color-text-secondary)",
        }}
      >
        {value}
      </p>
    </div>
  );
}
