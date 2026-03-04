import type { Area } from "@/shared/config/constants";
import { AREAS } from "@/shared/config/constants";
import type { GoalWithTasks } from "../goals.types";

export function currentQuarter(): string {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${quarter}`;
}

export function formatQuarterLabel(quarter: string): string {
  const [year, q] = quarter.split("-");
  return `${q} ${year}`;
}

export function calculateProgress(goal: GoalWithTasks): number {
  if (goal.tasks.length === 0) return 0;
  const completed = goal.tasks.filter((t) => t.status === "completed").length;
  return completed / goal.tasks.length;
}

export function groupGoalsByArea<T extends GoalWithTasks>(
  goals: T[],
): Record<Area, T[]> {
  return AREAS.reduce<Record<Area, T[]>>(
    (acc, area) => {
      acc[area] = goals.filter((g) => g.area === area);
      return acc;
    },
    { work: [], personal: [], identity: [] },
  );
}
