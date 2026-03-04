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
          className="text-xs font-medium font-body uppercase tracking-widest text-text-tertiary"
        >
          Tomorrow&rsquo;s focus
        </label>
        <p
          className="text-sm font-body text-text-tertiary"
        >
          What&rsquo;s the one thing that would make tomorrow a success?
        </p>
        <textarea
          id="tomorrow-focus"
          rows={4}
          value={tomorrowFocus}
          placeholder="I want to..."
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none rounded-xl px-4 py-3 font-body text-sm outline-none"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
            color: "var(--color-text-primary)",
          }}
        />
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="min-h-11 w-full rounded-xl font-body text-sm font-medium transition-opacity disabled:opacity-50 active:opacity-70"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
        }}
      >
        {isGenerating ? "Generating review..." : "Generate review"}
      </button>
    </div>
  );
}
