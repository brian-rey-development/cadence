import type { TaskModel } from "@/db/schema/tasks";
import {
  DAILY_TASK_LIMIT,
  DAILY_TASK_SOFT_WARNING,
} from "@/shared/config/constants";

export type LimitState = "low" | "warning" | "full";

export function getLimitState(
  count: number,
  limit = DAILY_TASK_LIMIT,
): LimitState {
  if (count >= limit) return "full";
  if (count >= DAILY_TASK_SOFT_WARNING) return "warning";
  return "low";
}

export function getActiveCount(tasks: TaskModel[]): number {
  return tasks.filter((t) => t.status !== "archived").length;
}
