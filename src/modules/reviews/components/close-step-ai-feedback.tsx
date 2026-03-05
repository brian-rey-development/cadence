"use client";

type AiFeedbackData = {
  feedback: string;
  insights: string[];
  nextDayFocus: string;
};

type CloseStepAiFeedbackProps = {
  data: AiFeedbackData;
  onSave: () => Promise<void>;
  isSaving: boolean;
};

export default function CloseStepAiFeedback({
  data,
  onSave,
  isSaving,
}: CloseStepAiFeedbackProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        {data.feedback.split("\n\n").map((para, i) => (
          <p
            key={`feedback-${i}`}
            className="font-body text-sm leading-relaxed text-text-secondary"
          >
            {para}
          </p>
        ))}
      </div>

      {data.insights.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium font-body uppercase tracking-widest text-text-tertiary">
            Insights
          </span>
          <ul className="flex flex-col gap-2">
            {data.insights.map((insight, i) => (
              <li key={`insight-${i}`} className="flex gap-2.5 items-start">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--color-text-tertiary)" }}
                />
                <span className="font-body text-sm leading-relaxed text-text-secondary">
                  {insight}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.nextDayFocus && (
        <div className="rounded-xl px-4 py-3 bg-bg-elevated">
          <span className="text-xs font-medium font-body uppercase tracking-widest text-text-tertiary">
            Tomorrow
          </span>
          <p className="mt-1 font-body text-sm leading-relaxed text-text-primary">
            {data.nextDayFocus}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="min-h-11 w-full rounded-xl font-body text-sm font-medium transition-opacity disabled:opacity-50 active:opacity-70"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
        }}
      >
        {isSaving ? "Saving..." : "Save & Close"}
      </button>
    </div>
  );
}
