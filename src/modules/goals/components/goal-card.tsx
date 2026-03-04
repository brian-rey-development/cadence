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
      className={`flex flex-col pl-4 py-3 transition-opacity duration-200 ease-default ${isActive ? "opacity-100" : "opacity-50"}`}
      style={{ borderLeft: `2px solid ${config.accent}` }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <span className="text-sm font-body leading-snug text-text-primary">
            {goal.title}
          </span>

          {goal.description && (
            <span className="text-sm font-body line-clamp-2 text-text-secondary">
              {goal.description}
            </span>
          )}

          {!isActive && (
            <span
              className="text-xs font-medium font-body px-2 py-0.5 rounded-full capitalize mt-0.5 self-start"
              style={{
                backgroundColor:
                  goal.status === "achieved"
                    ? config.subtle
                    : "var(--color-bg-elevated)",
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
                className="font-body text-xs"
                style={{ color: config.text }}
              >
                Milestones
              </span>
              <ChevronDown
                size={12}
                strokeWidth={1.5}
                className={`transition-transform duration-200 ${showMilestones ? "rotate-180" : "rotate-0"}`}
                style={{ color: config.text }}
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
          <span className="font-mono text-2xs text-text-tertiary">
            {completedCount}/{totalCount}
          </span>

          {isActive && (
            <div className="flex gap-1 mt-1">
              <button
                type="button"
                onClick={() => onStatusChange(goal.id, "achieved")}
                disabled={isUpdating}
                className="px-2.5 py-1 rounded-full font-body text-xs font-medium transition-opacity active:opacity-70 disabled:opacity-50"
                style={{ backgroundColor: config.subtle, color: config.text }}
                aria-label="Mark as achieved"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(goal.id, "abandoned")}
                disabled={isUpdating}
                className="px-2.5 py-1 rounded-full font-body text-xs font-medium transition-opacity active:opacity-70 disabled:opacity-50 bg-bg-elevated text-text-tertiary"
                aria-label="Mark as abandoned"
              >
                Drop
              </button>
            </div>
          )}
        </div>
      </div>

      {isActive && showMilestones && (
        <div className="mt-3 pt-3 border-t border-border-subtle">
          {isBreakdownLoading && (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-3 rounded-full animate-pulse bg-bg-elevated"
                  style={{ width: `${60 + i * 10}%` }}
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
            <p className="font-body text-xs text-center py-2 text-text-tertiary">
              Planning milestones...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
