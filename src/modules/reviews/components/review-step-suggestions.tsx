"use client";

import { useEffect, useState } from "react";
import type { WeeklyStats } from "../queries/get-weekly-stats";

type ReviewStepSuggestionsProps = {
  wins: string;
  blockers: string;
  goals: Array<{ title: string; area: string }>;
  stats: WeeklyStats;
  onSave: (intentions: string, aiSuggestions: string) => void;
};

type AIResult = {
  suggestions: string[];
  intentions: string;
};

export default function ReviewStepSuggestions({
  wins,
  blockers,
  goals,
  stats,
  onSave,
}: ReviewStepSuggestionsProps) {
  const [result, setResult] = useState<AIResult | null>(null);
  const [intentions, setIntentions] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const res = await fetch("/api/ai/weekly-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wins, blockers, goals, stats }),
        });

        if (!res.ok) throw new Error("Failed to get suggestions");

        const data: AIResult = await res.json();
        setResult(data);
        setIntentions(data.intentions);
      } catch {
        setError("Could not load suggestions. You can still save your review.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuggestions();
  }, [wins, blockers, goals, stats]);

  const aiSuggestions = result?.suggestions.join("\n") ?? "";

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-display text-lg text-text-primary">Next week</h3>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-full animate-pulse rounded-lg"
              style={{ backgroundColor: "var(--color-bg-subtle)" }}
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          {error}
        </p>
      )}

      {result && !isLoading && (
        <div className="flex flex-col gap-2">
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Suggestions
          </p>
          <ul className="flex flex-col gap-2">
            {result.suggestions.map((s) => (
              <li
                key={s}
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  backgroundColor: "var(--color-bg-subtle)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p
          className="text-xs uppercase tracking-wide"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Intentions
        </p>
        <textarea
          value={intentions}
          onChange={(e) => setIntentions(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "var(--color-bg-subtle)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border-subtle)",
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => onSave(intentions, aiSuggestions)}
        disabled={isLoading}
        className="w-full rounded-xl py-3.5 text-sm font-medium transition-opacity active:opacity-70 disabled:opacity-40"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
          minHeight: 44,
        }}
      >
        Save Review
      </button>
    </div>
  );
}
