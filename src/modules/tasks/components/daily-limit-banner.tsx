import type { TaskModel } from "@/db/schema/tasks";
import { DAILY_TASK_LIMIT } from "@/shared/config/constants";
import { getActiveCount, getLimitState } from "../utils/limit";

const STATE_COLORS: Record<string, string> = {
  low: "var(--color-text-secondary)",
  warning: "var(--color-warning-text)",
  full: "var(--color-destructive-text)",
};

type DailyLimitBannerProps = {
  tasks: TaskModel[];
  dailyTaskLimit?: number;
};

export default function DailyLimitBanner({
  tasks,
  dailyTaskLimit = DAILY_TASK_LIMIT,
}: DailyLimitBannerProps) {
  const count = getActiveCount(tasks);
  const state = getLimitState(count, dailyTaskLimit);

  return (
    <span
      className="font-mono text-base tabular-nums"
      style={{ color: STATE_COLORS[state] }}
    >
      {count}/{dailyTaskLimit}
    </span>
  );
}
