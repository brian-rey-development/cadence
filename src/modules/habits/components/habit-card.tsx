import AreaBadge from "@/shared/components/common/area-badge";
import { AREA_CONFIG } from "@/shared/config/areas";
import { today } from "@/shared/utils/date";
import type { HabitWithStats } from "../habits.types";
import HabitHeatmap from "./habit-heatmap";

type HabitCardProps = {
  habit: HabitWithStats;
  onToggle: (habitId: string, isLogged: boolean) => void;
  isPending?: boolean;
};

export default function HabitCard({
  habit,
  onToggle,
  isPending,
}: HabitCardProps) {
  const config = AREA_CONFIG[habit.area];
  const todayStr = today();
  const isLoggedToday = habit.logs.some((l) => l.date === todayStr);

  return (
    <div className="flex flex-col gap-2.5 py-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-medium font-body text-text-primary">
            {habit.name}
          </span>
          <div className="flex items-center gap-2">
            <AreaBadge area={habit.area} />
            <span className="text-sm font-mono text-text-tertiary">
              🔥 {habit.streak.current}
              <span className="ml-1.5 opacity-60">
                / {habit.streak.longest} best
              </span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggle(habit.id, isLoggedToday)}
          disabled={isPending}
          className="flex items-center justify-center h-10 w-10 rounded-full transition-colors duration-150 disabled:opacity-50"
          style={{
            backgroundColor: isLoggedToday ? config.accent : "transparent",
            border: `1.5px solid ${isLoggedToday ? config.accent : config.border}`,
          }}
          aria-label={isLoggedToday ? "Unlog habit" : "Log habit"}
        >
          {isLoggedToday && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-bg-base"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      </div>

      <HabitHeatmap days={habit.heatmap} accent={config.accent} />
    </div>
  );
}
