import type { DailyReviewModel } from "@/db/schema/reviews";
import EmptyState from "@/shared/components/common/empty-state";

type DailyJournalHistoryProps = {
  journals: DailyReviewModel[];
};

const MOOD_LABELS: Record<string, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  tough: "Tough",
};

function formatDateLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function DailyJournalHistory({
  journals,
}: DailyJournalHistoryProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-widest font-body text-text-tertiary">
        Journal
      </p>

      {journals.length === 0 ? (
        <EmptyState
          title="No journal entries yet"
          description="Close your first day to create a journal entry."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {journals.map((journal) => (
            <div
              key={journal.id}
              className="flex flex-col gap-3 px-4 py-4 rounded-2xl bg-bg-elevated"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium font-body text-text-primary"
                >
                  {formatDateLabel(journal.date)}
                </span>
                {journal.mood && (
                  <span
                    className="text-xs font-body px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--color-bg-surface)",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    {MOOD_LABELS[journal.mood] ?? journal.mood}
                  </span>
                )}
              </div>

              {journal.aiFeedback && (
                <p
                  className="text-sm font-body leading-relaxed text-text-secondary"
                >
                  {journal.aiFeedback.split("\n\n")[0]}
                </p>
              )}

              {journal.aiNextDayFocus && (
                <p
                  className="text-xs font-body italic text-text-tertiary"
                >
                  Tomorrow: {journal.aiNextDayFocus}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
