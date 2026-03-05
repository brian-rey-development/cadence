"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS, type Area } from "@/shared/config/constants";
import type { GoalWithMilestones } from "../goals.types";
import { useDeleteGoal } from "../hooks/use-delete-goal";
import { useGoals } from "../hooks/use-goals";
import { useUpdateGoalStatus } from "../hooks/use-update-goal-status";
import { calculateProgress, groupGoalsByArea } from "../utils/goal-utils";
import CreateGoalSheet from "./create-goal-sheet";
import GoalCard from "./goal-card";

type GoalListProps = {
  initialData: GoalWithMilestones[];
  currentQuarterLabel: string;
};

export default function GoalList({
  initialData,
  currentQuarterLabel,
}: GoalListProps) {
  const { data: goals } = useGoals(initialData);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateGoalStatus();
  const { mutate: deleteGoal } = useDeleteGoal();
  const [sheetOpen, setSheetOpen] = useState(false);

  const enriched = useMemo(
    () => goals.map((g) => ({ ...g, progress: calculateProgress(g) })),
    [goals],
  );
  const byArea = useMemo(() => groupGoalsByArea(enriched), [enriched]);

  const activeCountByArea = useMemo(
    () =>
      AREAS.reduce<Record<Area, number>>(
        (acc, area) => {
          acc[area] = goals.filter(
            (g) => g.area === area && g.status === "active",
          ).length;
          return acc;
        },
        { work: 0, personal: 0, identity: 0 },
      ),
    [goals],
  );

  const hasAny = goals.length > 0;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium font-display text-text-primary">
            {currentQuarterLabel}
          </span>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-150 bg-bg-surface"
            aria-label="Add goal"
          >
            <Plus size={18} strokeWidth={1.5} className="text-text-primary" />
          </button>
        </div>

        {!hasAny && (
          <div className="flex flex-col items-center gap-3 py-16">
            <span className="text-base font-body text-text-secondary">
              No goals this quarter
            </span>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="text-base font-medium font-body text-text-primary"
            >
              Add your first goal
            </button>
          </div>
        )}

        {AREAS.map((area) => {
          const areaGoals = byArea[area];
          if (areaGoals.length === 0) return null;

          return (
            <div key={area} className="flex flex-col gap-4">
              <span
                className="text-2xs font-semibold font-body uppercase tracking-label"
                style={{ color: AREA_CONFIG[area].accent }}
              >
                {AREA_CONFIG[area].label}
              </span>
              {areaGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onStatusChange={(goalId, status) =>
                    updateStatus({ goalId, status })
                  }
                  onDelete={deleteGoal}
                  isUpdating={isUpdating}
                />
              ))}
            </div>
          );
        })}
      </div>

      <CreateGoalSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        goalsByArea={activeCountByArea}
      />
    </>
  );
}
