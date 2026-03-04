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
      <h3 className="font-['Fraunces'] text-lg text-[var(--color-text-primary)]">
        Blockers
      </h3>

      <textarea
        value={blockers}
        onChange={(e) => setBlockers(e.target.value)}
        placeholder="What are you avoiding?"
        rows={5}
        className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none"
        style={{
          backgroundColor: "var(--color-bg-subtle)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border-subtle)",
        }}
      />

      <button
        type="button"
        onClick={() => onNext(blockers)}
        className="w-full rounded-xl py-3.5 text-sm font-medium transition-opacity active:opacity-70"
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
