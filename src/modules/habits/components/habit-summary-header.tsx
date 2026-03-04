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
        className="text-[28px] font-['DM_Mono'] leading-none"
        style={{ color: consistencyColor(consistency) }}
      >
        {consistency}%
      </span>
      <span
        className="text-[13px] font-['DM_Sans']"
        style={{ color: "var(--color-text-secondary)" }}
      >
        consistency this week
      </span>
    </div>
  );
}
