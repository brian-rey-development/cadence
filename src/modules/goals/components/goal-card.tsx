"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Milestone } from "@/modules/ai-engine/ai-engine.types";
import { useGoalBreakdown } from "@/modules/ai-engine/hooks/use-goal-breakdown";
import ProgressRing from "@/shared/components/ui/progress-ring";
import { AREA_CONFIG } from "@/shared/config/areas";
import type { GoalWithProgress } from "../goals.types";
import GoalMilestones from "./goal-milestones";

type GoalCardProps = {
  goal: GoalWithProgress;
  userId: string;
  onStatusChange: (goalId: string, status: "achieved" | "abandoned") => void;
  isUpdating: boolean;
};

export default function GoalCard({
  goal,
  userId,
  onStatusChange,
  isUpdating,
}: GoalCardProps) {
  const config = AREA_CONFIG[goal.area];
  const completedCount = goal.tasks.filter(
    (t) => t.status === "completed",
  ).length;
  const totalCount = goal.tasks.length;
  const isActive = goal.status === "active";
  const [showMilestones, setShowMilestones] = useState(false);

  const { data: breakdown, isLoading: isBreakdownLoading } = useGoalBreakdown(
    userId,
    goal.id,
  );

  const milestones = (breakdown?.milestones ?? []) as Milestone[];

  return (
    <div
      className="flex flex-col rounded-[12px] px-4 py-3 transition-opacity duration-[200ms] ease-[var(--ease-default)]"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        borderLeft: `3px solid ${config.accent}`,
        opacity: isActive ? 1 : 0.6,
      }}
    >
      <div className="flex items-start gap-3">
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

          {isActive && (
            <button
              type="button"
              onClick={() => setShowMilestones((v) => !v)}
              className="flex items-center gap-1 mt-1 w-fit"
              aria-label={
                showMilestones ? "Hide milestones" : "Show milestones"
              }
            >
              <span
                className="font-['DM_Sans'] text-[11px]"
                style={{ color: config.text }}
              >
                Milestones
              </span>
              <ChevronDown
                size={12}
                strokeWidth={1.5}
                style={{
                  color: config.text,
                  transform: showMilestones ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <ProgressRing
            progress={goal.progress}
            size={40}
            strokeWidth={3}
            color={config.accent}
          />
          <span
            className="font-['DM_Mono'] text-[10px]"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {completedCount}/{totalCount}
          </span>

          {isActive && (
            <div className="flex gap-1 mt-1">
              <button
                type="button"
                onClick={() => onStatusChange(goal.id, "achieved")}
                disabled={isUpdating}
                className="px-2.5 py-1 rounded-full font-['DM_Sans'] text-[11px] font-medium transition-opacity active:opacity-70 disabled:opacity-50"
                style={{ backgroundColor: config.subtle, color: config.text }}
                aria-label="Mark as achieved"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(goal.id, "abandoned")}
                disabled={isUpdating}
                className="px-2.5 py-1 rounded-full font-['DM_Sans'] text-[11px] font-medium transition-opacity active:opacity-70 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--color-bg-elevated)",
                  color: "var(--color-text-tertiary)",
                }}
                aria-label="Mark as abandoned"
              >
                Drop
              </button>
            </div>
          )}
        </div>
      </div>

      {isActive && showMilestones && (
        <div
          className="mt-3 pt-3"
          style={{ borderTop: "1px solid var(--color-border-subtle)" }}
        >
          {isBreakdownLoading && (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-3 rounded-full animate-pulse"
                  style={{
                    backgroundColor: "var(--color-bg-elevated)",
                    width: `${60 + i * 10}%`,
                  }}
                />
              ))}
            </div>
          )}
          {!isBreakdownLoading && milestones.length > 0 && (
            <GoalMilestones
              milestones={milestones}
              goalId={goal.id}
              area={goal.area}
              accentColor={config.accent}
            />
          )}
          {!isBreakdownLoading && milestones.length === 0 && (
            <p
              className="font-['DM_Sans'] text-[12px] text-center py-2"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Planning milestones...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
