import type { TaskModel } from "@/db/schema/tasks";
import { ZOMBIE_DAYS } from "@/shared/config/constants";
import { today } from "@/shared/utils/date";

function taskAgeDays(dateStr: string): number {
  const taskMs = new Date(dateStr).setHours(0, 0, 0, 0);
  const todayMs = new Date(today()).setHours(0, 0, 0, 0);
  return Math.floor((todayMs - taskMs) / 86_400_000);
}

export function isZombie(task: TaskModel): boolean {
  if (task.status !== "pending" || !task.date) return false;
  return taskAgeDays(task.date) >= ZOMBIE_DAYS;
}

export function getZombieAge(task: TaskModel): number {
  if (!task.date) return 0;
  return taskAgeDays(task.date);
}
