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
    <div className="flex flex-col gap-1.5">
      <p className="font-display text-base italic leading-relaxed text-text-tertiary">
        {data.quote}
      </p>
      <span
        className="self-start rounded-full px-2 py-0.5 text-2xs font-body font-medium uppercase tracking-widest"
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
