"use client";

import { CheckCircle, Circle } from "lucide-react";
import type { TaskWithGoal } from "../tasks.types";
import { AREA_CONFIG } from "@/shared/config/areas";

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
        className="flex-1 text-sm font-body leading-snug"
        style={{
          color: isDone
            ? "var(--color-text-tertiary)"
            : "var(--color-text-primary)",
          textDecoration: isDone ? "line-through" : "none",
        }}
      >
        {task.title}
      </span>

      {task.goal && (
        <span
          className="text-xs font-body shrink-0"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {task.goal.title.slice(0, 20)}
        </span>
      )}
    </div>
  );
}
