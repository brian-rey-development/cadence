"use client";

type HabitSummaryBarProps = {
  total: number;
  completed: number;
};

export default function HabitSummaryBar({
  total,
  completed,
}: HabitSummaryBarProps) {
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs font-body uppercase tracking-sm text-text-tertiary">
        habits today
      </span>
      <span className="font-mono text-xs text-text-secondary">
        {completed}/{total}
      </span>
    </div>
  );
}
