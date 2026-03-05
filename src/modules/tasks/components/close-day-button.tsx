"use client";

import { MoonStar } from "lucide-react";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS } from "@/shared/config/constants";
import type { TaskWithGoal } from "../tasks.types";

type CloseDayButtonProps = {
  tasks: TaskWithGoal[];
  closeDayAfterHour: number;
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

function isVisible(tasks: TaskWithGoal[], closeDayAfterHour: number): boolean {
  const hour = new Date().getHours();
  const allDone =
    tasks.length > 0 &&
    tasks.every((t) => t.status === "completed" || t.status === "archived");
  return hour >= closeDayAfterHour || allDone;
}

export default function CloseDayButton({
  tasks,
  closeDayAfterHour,
  onClick,
}: CloseDayButtonProps) {
  if (!isVisible(tasks, closeDayAfterHour)) return null;

  const accentColor = getDominantAreaColor(tasks);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 min-h-11 px-6 rounded-full border-2 font-body text-base font-medium transition-all active:opacity-80"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        color: "var(--color-text-primary)",
        borderColor: accentColor,
      }}
    >
      <MoonStar size={18} strokeWidth={1.5} />
      Close Day
    </button>
  );
}
