import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS } from "@/shared/config/constants";
import type { WeeklyStats } from "../queries/get-weekly-stats";

type ReviewStepStatsProps = {
  stats: WeeklyStats;
  onNext: () => void;
};

export default function ReviewStepStats({
  stats,
  onNext,
}: ReviewStepStatsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-['Fraunces'] text-lg text-[var(--color-text-primary)] mb-4">
          This week at a glance
        </h3>

        <div className="flex flex-col gap-4">
          {AREAS.map((area) => {
            const areaStats = stats.tasksByArea[area] ?? {
              completed: 0,
              total: 0,
            };
            const pct =
              areaStats.total > 0
                ? Math.round((areaStats.completed / areaStats.total) * 100)
                : 0;
            const config = AREA_CONFIG[area];

            return (
              <div key={area} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: config.accent }}
                    />
                    <span className="text-[13px] font-['DM_Sans'] text-[var(--color-text-secondary)]">
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['DM_Mono'] text-[13px] text-[var(--color-text-secondary)]">
                      {areaStats.completed}/{areaStats.total}
                    </span>
                    <span className="font-['DM_Mono'] text-[13px] text-[var(--color-text-primary)]">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div
                  className="h-2 w-full rounded-full"
                  style={{ backgroundColor: "var(--color-border-subtle)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: config.accent,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="flex items-center justify-between rounded-lg px-4 py-3"
        style={{ backgroundColor: "var(--color-bg-subtle)" }}
      >
        <span className="text-sm text-[var(--color-text-secondary)]">
          Habit consistency
        </span>
        <span className="font-['DM_Mono'] text-base text-[var(--color-text-primary)]">
          {stats.habitConsistency}%
        </span>
      </div>

      {stats.zombieCount > 0 && (
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-3"
          style={{
            backgroundColor: "var(--color-status-zombie-subtle)",
            border: "1px solid var(--color-zombie)",
          }}
        >
          <span
            className="font-['DM_Mono'] text-xs"
            style={{ color: "var(--color-zombie-text)" }}
          >
            ☠
          </span>
          <span
            className="text-sm"
            style={{ color: "var(--color-zombie-text)" }}
          >
            {stats.zombieCount} task{stats.zombieCount > 1 ? "s" : ""} postponed
            2+ times
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="mt-2 w-full rounded-xl py-3.5 text-sm font-medium transition-opacity active:opacity-70"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
          minHeight: 44,
        }}
      >
        Continue
      </button>
    </div>
  );
}
