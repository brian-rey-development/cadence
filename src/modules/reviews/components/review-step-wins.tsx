"use client";

import { useState } from "react";

type ReviewStepWinsProps = {
  onNext: (wins: string) => void;
};

export default function ReviewStepWins({ onNext }: ReviewStepWinsProps) {
  const [wins, setWins] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-['Fraunces'] text-lg text-[var(--color-text-primary)]">
        Wins
      </h3>

      <textarea
        value={wins}
        onChange={(e) => setWins(e.target.value)}
        placeholder="What moved the needle this week?"
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
        onClick={() => onNext(wins)}
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
