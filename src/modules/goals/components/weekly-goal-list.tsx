"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { GoalModel } from "@/db/schema/goals";
import ProgressRing from "@/shared/components/ui/progress-ring";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS, type Area } from "@/shared/config/constants";
import type { GoalWithTasksAndParent } from "../goals.types";
import { calculateProgress } from "../utils/goal-utils";
import CreateGoalSheet from "./create-goal-sheet";

type WeeklyGoalListProps = {
  initialGoals: GoalWithTasksAndParent[];
  quarterlyGoals: GoalModel[];
};

export default function WeeklyGoalList({
  initialGoals,
  quarterlyGoals,
}: WeeklyGoalListProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const byArea = useMemo(
    () =>
      AREAS.reduce<Record<Area, GoalWithTasksAndParent[]>>(
        (acc, area) => {
          acc[area] = initialGoals.filter((g) => g.area === area);
          return acc;
        },
        { work: [], personal: [], identity: [] },
      ),
    [initialGoals],
  );

  const activeCountByArea = useMemo(
    () =>
      AREAS.reduce<Record<Area, number>>(
        (acc, area) => {
          acc[area] = initialGoals.filter(
            (g) => g.area === area && g.status === "active",
          ).length;
          return acc;
        },
        { work: 0, personal: 0, identity: 0 },
      ),
    [initialGoals],
  );

  const hasAny = initialGoals.length > 0;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium font-display text-text-primary">
            Weekly goals
          </span>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-150 bg-bg-surface"
            aria-label="Add weekly goal"
          >
            <Plus size={18} strokeWidth={1.5} className="text-text-primary" />
          </button>
        </div>

        {!hasAny && (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="text-sm font-body text-text-tertiary py-4 text-center w-full"
          >
            No weekly goals — add one
          </button>
        )}

        {AREAS.map((area) => {
          const areaGoals = byArea[area];
          if (areaGoals.length === 0) return null;
          const config = AREA_CONFIG[area];

          return (
            <div key={area} className="flex flex-col gap-3">
              <span
                className="text-2xs font-semibold font-body uppercase tracking-label"
                style={{ color: config.accent }}
              >
                {config.label}
              </span>
              {areaGoals.map((goal) => {
                const progress = calculateProgress(goal);
                const completed = goal.tasks.filter(
                  (t) => t.status === "completed",
                ).length;

                return (
                  <div
                    key={goal.id}
                    className="flex items-center gap-3 pl-4 py-3"
                    style={{ borderLeft: `2px solid ${config.accent}` }}
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="text-sm font-body leading-snug text-text-primary">
                        {goal.title}
                      </span>
                      {goal.parentGoal && (
                        <span className="text-xs font-body text-text-tertiary truncate">
                          {goal.parentGoal.title}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <ProgressRing
                        progress={progress}
                        size={32}
                        strokeWidth={2.5}
                        color={config.accent}
                      />
                      <span className="font-mono text-2xs text-text-tertiary">
                        {completed}/{goal.tasks.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <CreateGoalSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        goalsByArea={activeCountByArea}
        quarterlyGoals={quarterlyGoals}
        defaultScope="weekly"
      />
    </>
  );
}
