"use client";

type CloseStepTomorrowProps = {
  tomorrowFocus: string;
  onChange: (value: string) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
};

export default function CloseStepTomorrow({
  tomorrowFocus,
  onChange,
  onGenerate,
  isGenerating,
}: CloseStepTomorrowProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="tomorrow-focus"
          className="text-sm font-medium font-body uppercase tracking-widest text-text-tertiary"
        >
          Tomorrow&rsquo;s focus
        </label>
        <p className="text-base font-body text-text-tertiary">
          What&rsquo;s the one thing that would make tomorrow a success?
        </p>
        <textarea
          id="tomorrow-focus"
          rows={4}
          value={tomorrowFocus}
          placeholder="I want to..."
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none rounded-xl px-4 py-3 font-body text-base outline-none bg-bg-elevated border border-border-default text-text-primary"
        />
        {isGenerating && (
          <p className="text-sm font-body text-text-tertiary animate-pulse">
            Claude is reviewing your day...
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="min-h-11 w-full rounded-xl font-body text-base font-medium transition-opacity disabled:opacity-50 active:opacity-70 bg-[var(--color-text-primary)] text-[var(--color-bg-base)]"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            Generating...
          </span>
        ) : (
          "Generate review"
        )}
      </button>
    </div>
  );
}
