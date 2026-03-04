"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS, type Area } from "@/shared/config/constants";
import type { GoalWithTasks } from "../goals.types";
import { useGoals } from "../hooks/use-goals";
import { useUpdateGoalStatus } from "../hooks/use-update-goal-status";
import { calculateProgress, groupGoalsByArea } from "../utils/goal-utils";
import CreateGoalSheet from "./create-goal-sheet";
import GoalCard from "./goal-card";

type GoalListProps = {
  initialData: GoalWithTasks[];
  currentQuarterLabel: string;
  userId: string;
};

export default function GoalList({
  initialData,
  currentQuarterLabel,
  userId,
}: GoalListProps) {
  const { data: goals } = useGoals(initialData);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateGoalStatus();
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
          <span
            className="text-[15px] font-medium font-['Fraunces']"
            style={{ color: "var(--color-text-primary)" }}
          >
            {currentQuarterLabel}
          </span>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-150"
            style={{ backgroundColor: "var(--color-bg-surface)" }}
            aria-label="Add goal"
          >
            <Plus
              size={18}
              strokeWidth={1.5}
              style={{ color: "var(--color-text-primary)" }}
            />
          </button>
        </div>

        {!hasAny && (
          <div
            className="flex flex-col items-center gap-3 py-16 rounded-[12px]"
            style={{ backgroundColor: "var(--color-bg-surface)" }}
          >
            <span
              className="text-[15px] font-['DM_Sans']"
              style={{ color: "var(--color-text-secondary)" }}
            >
              No goals this quarter
            </span>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="text-[13px] font-medium font-['DM_Sans']"
              style={{ color: "var(--color-text-primary)" }}
            >
              Add your first goal
            </button>
          </div>
        )}

        {AREAS.map((area) => {
          const areaGoals = byArea[area];
          if (areaGoals.length === 0) return null;

          return (
            <div key={area} className="flex flex-col gap-3">
              <span
                className="text-[11px] font-medium font-['DM_Sans'] uppercase tracking-widest"
                style={{ color: AREA_CONFIG[area].text }}
              >
                {AREA_CONFIG[area].label}
              </span>
              {areaGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  userId={userId}
                  onStatusChange={(goalId, status) =>
                    updateStatus({ goalId, status })
                  }
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
