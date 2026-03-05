"use client";

import { useState } from "react";

type ReviewStepWinsProps = {
  onNext: (wins: string) => void;
};

export default function ReviewStepWins({ onNext }: ReviewStepWinsProps) {
  const [wins, setWins] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl text-text-primary">Wins</h3>
        <p className="text-base font-body text-text-secondary">
          What moved the needle this week?
        </p>
      </div>

      <textarea
        value={wins}
        onChange={(e) => setWins(e.target.value)}
        placeholder="One thing you're proud of completing..."
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
        onClick={() => onNext(wins)}
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
