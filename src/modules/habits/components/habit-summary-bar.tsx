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
    <div
      className="flex items-center justify-between px-4 py-3 rounded-[10px]"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <span
        className="text-sm font-['DM_Sans']"
        style={{ color: "var(--color-text-secondary)" }}
      >
        habits today
      </span>
      <span
        className="font-['DM_Mono'] text-sm"
        style={{ color: "var(--color-text-primary)" }}
      >
        {completed}/{total}
      </span>
    </div>
  );
}
