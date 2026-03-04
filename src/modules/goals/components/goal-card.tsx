"use client";

import { Check, X } from "lucide-react";
import ProgressRing from "@/shared/components/ui/progress-ring";
import { AREA_CONFIG } from "@/shared/config/areas";
import type { GoalWithProgress } from "../goals.types";

type GoalCardProps = {
  goal: GoalWithProgress;
  onStatusChange: (goalId: string, status: "achieved" | "abandoned") => void;
  isUpdating: boolean;
};

export default function GoalCard({
  goal,
  onStatusChange,
  isUpdating,
}: GoalCardProps) {
  const config = AREA_CONFIG[goal.area];
  const completedCount = goal.tasks.filter(
    (t) => t.status === "completed",
  ).length;
  const totalCount = goal.tasks.length;
  const isActive = goal.status === "active";

  return (
    <div
      className="flex items-start gap-3 rounded-[12px] px-4 py-3 transition-opacity duration-[200ms] ease-[var(--ease-default)]"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        borderLeft: `3px solid ${config.accent}`,
        opacity: isActive ? 1 : 0.6,
      }}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span
          className="text-[15px] font-['DM_Sans'] leading-snug"
          style={{ color: "var(--color-text-primary)" }}
        >
          {goal.title}
        </span>

        {goal.description && (
          <span
            className="text-[13px] font-['DM_Sans'] line-clamp-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {goal.description}
          </span>
        )}

        {!isActive && (
          <span
            className="text-[12px] font-medium font-['DM_Sans'] mt-0.5"
            style={{
              color:
                goal.status === "achieved"
                  ? config.text
                  : "var(--color-text-tertiary)",
            }}
          >
            {goal.status}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="flex flex-col items-center gap-0.5">
          <ProgressRing
            progress={goal.progress}
            size={32}
            strokeWidth={2.5}
            color={config.accent}
          />
          <span
            className="text-[10px] font-['DM_Mono']"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {completedCount}/{totalCount}
          </span>
        </div>

        {isActive && (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onStatusChange(goal.id, "achieved")}
              disabled={isUpdating}
              className="flex items-center justify-center h-11 w-9 rounded-[8px] transition-colors duration-150"
              style={{ backgroundColor: "var(--color-bg-base)" }}
              aria-label="Mark as achieved"
            >
              <Check
                size={14}
                strokeWidth={1.5}
                style={{ color: config.text }}
              />
            </button>
            <button
              type="button"
              onClick={() => onStatusChange(goal.id, "abandoned")}
              disabled={isUpdating}
              className="flex items-center justify-center h-11 w-9 rounded-[8px] transition-colors duration-150"
              style={{ backgroundColor: "var(--color-bg-base)" }}
              aria-label="Mark as abandoned"
            >
              <X
                size={14}
                strokeWidth={1.5}
                style={{ color: "var(--color-text-tertiary)" }}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
