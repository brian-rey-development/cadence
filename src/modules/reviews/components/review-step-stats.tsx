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
        <h3 className="font-display text-lg text-text-primary mb-4">
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
                    <span className="text-sm font-body text-text-secondary">
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-text-secondary">
                      {areaStats.completed}/{areaStats.total}
                    </span>
                    <span className="font-mono text-sm text-text-primary">
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
        <span className="text-sm text-text-secondary">Habit consistency</span>
        <span className="font-mono text-base text-text-primary">
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
            className="font-mono text-xs"
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
