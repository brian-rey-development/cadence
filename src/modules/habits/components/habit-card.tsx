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
    <div
      className="relative flex flex-col gap-3 rounded-[12px] overflow-hidden p-4"
      style={{ backgroundColor: "var(--color-bg-surface)" }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ backgroundColor: config.accent }}
      />
      <div className="flex items-center justify-between pl-1">
        <div className="flex flex-col gap-1">
          <span
            className="text-[15px] font-medium font-['DM_Sans']"
            style={{ color: "var(--color-text-primary)" }}
          >
            {habit.name}
          </span>
          <AreaBadge area={habit.area} />
        </div>

        <button
          type="button"
          onClick={() => onToggle(habit.id, isLoggedToday)}
          disabled={isPending}
          className="flex items-center justify-center h-11 w-11 rounded-full transition-colors duration-150 disabled:opacity-50"
          style={{
            backgroundColor: isLoggedToday ? config.accent : "transparent",
            border: `1.5px solid ${isLoggedToday ? config.accent : config.border}`,
          }}
          aria-label={isLoggedToday ? "Unlog habit" : "Log habit"}
        >
          {isLoggedToday && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ color: "var(--color-bg-base)" }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3 pl-1">
        <span
          className="text-[13px] font-['DM_Mono']"
          style={{ color: "var(--color-text-primary)" }}
        >
          🔥 {habit.streak.current}
        </span>
        <span
          className="text-[11px] font-['DM_Sans']"
          style={{ color: "var(--color-text-secondary)" }}
        >
          best {habit.streak.longest}
        </span>
      </div>

      <div className="pl-1">
        <HabitHeatmap days={habit.heatmap} accent={config.accent} />
      </div>
    </div>
  );
}
