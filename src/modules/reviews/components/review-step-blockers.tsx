"use client";

import { useState } from "react";

type ReviewStepBlockersProps = {
  onNext: (blockers: string) => void;
};

export default function ReviewStepBlockers({
  onNext,
}: ReviewStepBlockersProps) {
  const [blockers, setBlockers] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl text-text-primary">Blockers</h3>
        <p className="text-base font-body text-text-secondary">
          What kept getting in the way?
        </p>
      </div>

      <textarea
        value={blockers}
        onChange={(e) => setBlockers(e.target.value)}
        placeholder="Something I keep bumping into..."
        rows={5}
        className="w-full resize-none rounded-xl px-4 py-3 font-body text-base outline-none"
        style={{
          backgroundColor: "var(--color-bg-surface)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border-subtle)",
        }}
      />

      <button
        type="button"
        onClick={() => onNext(blockers)}
        className="w-full rounded-xl py-3.5 text-base font-medium transition-opacity active:opacity-70"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
          minHeight: 44,
        }}
      >
        Continue
      </button>
    </div>
  );
}
