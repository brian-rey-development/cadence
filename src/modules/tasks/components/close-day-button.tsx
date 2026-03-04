"use client";

import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS, CLOSE_DAY_AFTER_HOUR } from "@/shared/config/constants";
import type { TaskWithGoal } from "../tasks.types";

type CloseDayButtonProps = {
  tasks: TaskWithGoal[];
  onClick: () => void;
};

function getDominantAreaColor(tasks: TaskWithGoal[]): string {
  const counts = Object.fromEntries(AREAS.map((a) => [a, 0])) as Record<
    string,
    number
  >;
  for (const t of tasks) {
    if (t.status === "completed") counts[t.area]++;
  }
  const dominant = AREAS.reduce((a, b) => (counts[a] >= counts[b] ? a : b));
  return AREA_CONFIG[dominant].accent;
}

function isVisible(tasks: TaskWithGoal[]): boolean {
  const hour = new Date().getHours();
  const allDone = tasks.every(
    (t) => t.status === "completed" || t.status === "archived",
  );
  return hour >= CLOSE_DAY_AFTER_HOUR || allDone;
}

export default function CloseDayButton({
  tasks,
  onClick,
}: CloseDayButtonProps) {
  if (!isVisible(tasks)) return null;

  const accentColor = getDominantAreaColor(tasks);

  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[44px] px-4 rounded-xl font-['DM_Sans'] text-sm font-medium transition-all active:opacity-80"
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text-primary)",
        border: "1px solid var(--color-border-subtle)",
        boxShadow: `0 0 12px 0 ${accentColor}4D`,
      }}
    >
      Close Day
    </button>
  );
}
