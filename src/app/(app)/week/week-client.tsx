"use client";

import { useState } from "react";
import type { GoalModel } from "@/db/schema/goals";
import type { WeeklyReviewModel } from "@/db/schema/reviews";
import WeekIntentionsBanner from "@/modules/reviews/components/week-intentions-banner";
import WeeklyReviewSheet from "@/modules/reviews/components/weekly-review-sheet";
import type { WeeklyStats } from "@/modules/reviews/queries/get-weekly-stats";

type WeekClientProps = {
  stats: WeeklyStats;
  intentions: WeeklyReviewModel | undefined;
  goals: GoalModel[];
  weekStart: string;
};

export default function WeekClient({
  stats,
  intentions,
  goals,
  weekStart,
}: WeekClientProps) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const goalItems = goals.map((g) => ({ title: g.title, area: g.area }));
  const totalCompleted = Object.values(stats.tasksByArea).reduce(
    (sum, a) => sum + a.completed,
    0,
  );
  const totalTasks = Object.values(stats.tasksByArea).reduce(
    (sum, a) => sum + a.total,
    0,
  );

  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      <WeekIntentionsBanner intentions={intentions?.intentions ?? null} />

      <div
        className="flex items-center justify-between rounded-xl px-4 py-4"
        style={{ backgroundColor: "var(--color-bg-subtle)" }}
      >
        <div className="flex flex-col gap-0.5">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Tasks this week
          </span>
          <span
            className="font-['DM_Mono'] text-2xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            {totalCompleted}/{totalTasks}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Habit consistency
          </span>
          <span
            className="font-['DM_Mono'] text-2xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            {stats.habitConsistency}%
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsReviewOpen(true)}
        className="w-full rounded-xl py-3.5 text-sm font-medium transition-opacity active:opacity-70"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
          minHeight: 44,
        }}
      >
        Start Weekly Review
      </button>

      <WeeklyReviewSheet
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        stats={stats}
        goals={goalItems}
        weekStart={weekStart}
      />
    </div>
  );
}
