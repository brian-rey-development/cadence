"use client";

import { CheckCircle2 } from "lucide-react";
import type { TaskWithGoal } from "@/modules/tasks/tasks.types";
import { AREA_CONFIG } from "@/shared/config/areas";

type CloseStepCompletedProps = {
  tasks: TaskWithGoal[];
  onNext: () => void;
};

export default function CloseStepCompleted({
  tasks,
  onNext,
}: CloseStepCompletedProps) {
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 pt-2">
        <CheckCircle2
          size={32}
          strokeWidth={1.5}
          style={{ color: "var(--color-text-accent)" }}
        />
        <p
          className="font-['Fraunces'] text-lg text-center"
          style={{ color: "var(--color-text-primary)" }}
        >
          {completed.length === 0
            ? "No tasks completed today"
            : `${completed.length} task${completed.length === 1 ? "" : "s"} completed`}
        </p>
      </div>

      {completed.length > 0 && (
        <ul className="flex flex-col gap-2">
          {completed.map((task) => (
            <li
              key={task.id}
              className="relative flex items-center gap-3 rounded-lg px-4 py-3 min-h-[44px]"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <div
                className="absolute left-0 inset-y-2 w-[3px] rounded-full"
                style={{ backgroundColor: AREA_CONFIG[task.area].accent }}
              />
              <span
                className="font-['DM_Sans'] text-sm ml-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {task.title}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onNext}
        className="min-h-[44px] w-full rounded-xl font-['DM_Sans'] text-sm font-medium transition-opacity active:opacity-70"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
        }}
      >
        Continue
      </button>
    </div>
  );
}
