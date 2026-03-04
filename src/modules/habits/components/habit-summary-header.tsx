type HabitSummaryHeaderProps = {
  consistency: number;
};

function consistencyColor(value: number): string {
  if (value >= 80) return "var(--color-success)";
  if (value >= 50) return "var(--color-warning)";
  return "var(--color-text-secondary)";
}

export default function HabitSummaryHeader({
  consistency,
}: HabitSummaryHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-3xl font-mono leading-none"
        style={{ color: consistencyColor(consistency) }}
      >
        {consistency}%
      </span>
      <span
        className="text-sm font-body text-text-secondary"
      >
        consistency this week
      </span>
    </div>
  );
}
