"use client";

import { useDailyQuote } from "../hooks/use-daily-quote";

export default function DailyQuote() {
  const { data, isLoading, isError } = useDailyQuote();

  if (isLoading) {
    return (
      <div
        className="h-5 rounded-full animate-pulse"
        style={{
          backgroundColor: "var(--color-bg-elevated)",
          width: "70%",
        }}
      />
    );
  }

  if (isError || !data) return null;

  return (
    <div className="flex items-start gap-2.5">
      <p
        className="flex-1 font-display text-sm italic leading-relaxed text-text-tertiary"
      >
        {data.quote}
      </p>
      <span
        className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-2xs font-body font-medium uppercase tracking-widest"
        style={{
          backgroundColor: "var(--color-bg-elevated)",
          color: "var(--color-text-tertiary)",
        }}
      >
        {data.theme}
      </span>
    </div>
  );
}
