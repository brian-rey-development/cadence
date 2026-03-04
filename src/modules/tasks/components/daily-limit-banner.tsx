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
};

export default function DailyLimitBanner({ tasks }: DailyLimitBannerProps) {
  const count = getActiveCount(tasks);
  const state = getLimitState(count);

  return (
    <span
      className="font-['DM_Mono'] text-sm tabular-nums"
      style={{ color: STATE_COLORS[state] }}
    >
      {count}/{DAILY_TASK_LIMIT}
    </span>
  );
}
