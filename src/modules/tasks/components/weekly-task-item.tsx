"use client";

import { CheckCircle, Circle } from "lucide-react";
import { AREA_CONFIG } from "@/shared/config/areas";
import type { TaskWithGoal } from "../tasks.types";

type WeeklyTaskItemProps = {
  task: TaskWithGoal;
  onToggle: (id: string) => void;
};

export default function WeeklyTaskItem({
  task,
  onToggle,
}: WeeklyTaskItemProps) {
  const isDone = task.status === "completed";
  const areaColor = AREA_CONFIG[task.area].accent;

  return (
    <div className="flex items-center gap-3 py-2.5">
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        className="shrink-0 transition-opacity active:opacity-70"
        style={{ color: isDone ? areaColor : "var(--color-text-tertiary)" }}
        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
      >
        {isDone ? (
          <CheckCircle size={20} strokeWidth={1.5} />
        ) : (
          <Circle size={20} strokeWidth={1.5} />
        )}
      </button>

      <span
        className={`flex-1 text-base font-body leading-snug ${isDone ? "text-text-tertiary line-through" : "text-text-primary"}`}
      >
        {task.title}
      </span>

      {task.goal && (
        <span className="text-sm font-body shrink-0 text-text-tertiary">
          {task.goal.title.slice(0, 20)}
        </span>
      )}
    </div>
  );
}
