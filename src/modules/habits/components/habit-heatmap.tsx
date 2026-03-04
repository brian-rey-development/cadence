import { today } from "@/shared/utils/date";
import type { HeatmapDay } from "../habits.types";

type HabitHeatmapProps = {
  days: HeatmapDay[];
  accent: string;
};

export default function HabitHeatmap({ days, accent }: HabitHeatmapProps) {
  const todayStr = today();

  return (
    <div
      className="grid grid-cols-7 gap-[3px]"
      style={{ gridAutoRows: "12px" }}
    >
      {days.map(({ date, logged }) => {
        const isToday = date === todayStr;
        return (
          <div
            key={date}
            className="rounded-xs h-3"
            style={{
              backgroundColor: logged
                ? isToday
                  ? accent
                  : `color-mix(in srgb, ${accent} 80%, transparent)`
                : "var(--color-border-subtle)",
            }}
          />
        );
      })}
    </div>
  );
}
