"use client";

import Link from "next/link";
import { useState } from "react";
import type { GoalModel } from "@/db/schema/goals";
import type { WeeklyReviewModel } from "@/db/schema/reviews";
import WeeklyGoalList from "@/modules/goals/components/weekly-goal-list";
import type { GoalWithTasksAndParent } from "@/modules/goals/goals.types";
import WeekIntentionsBanner from "@/modules/reviews/components/week-intentions-banner";
import WeeklyReviewSheet from "@/modules/reviews/components/weekly-review-sheet";
import type { WeeklyStats } from "@/modules/reviews/queries/get-weekly-stats";
import WeeklyTasksSection from "@/modules/tasks/components/weekly-tasks-section";
import type { TaskWithGoal } from "@/modules/tasks/tasks.types";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS } from "@/shared/config/constants";

type WeekClientProps = {
  stats: WeeklyStats;
  intentions: WeeklyReviewModel | undefined;
  goals: GoalModel[];
  weekStart: string;
  weeklyTasks: TaskWithGoal[];
  weeklyGoals: GoalWithTasksAndParent[];
  weeklyGoalLimit: number;
};

function formatWeekRange(startStr: string): string {
  const start = new Date(`${startStr}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });

  if (start.getMonth() === end.getMonth()) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}`;
}

export default function WeekClient({
  stats,
  intentions,
  goals,
  weekStart,
  weeklyTasks,
  weeklyGoals,
  weeklyGoalLimit,
}: WeekClientProps) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const isSunday = new Date().getDay() === 0;

  const goalItems = goals.map((g) => ({ title: g.title, area: g.area }));
  const totalCompleted = Object.values(stats.tasksByArea).reduce(
    (sum, a) => sum + a.completed,
    0,
  );
  const totalTasks = Object.values(stats.tasksByArea).reduce(
    (sum, a) => sum + a.total,
    0,
  );

  const areaBreakdown = AREAS.filter(
    (area) => stats.tasksByArea[area]?.total > 0,
  );

  const quarterlyGoals = goals.filter((g) => g.scope === "quarterly");

  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary">Week</h1>
          <p className="text-base font-body text-text-tertiary">
            {formatWeekRange(weekStart)}
          </p>
        </div>
        <Link
          href="/review"
          className="mt-1 text-sm font-body text-text-tertiary hover:text-text-secondary transition-colors duration-150"
        >
          History
        </Link>
      </header>

      <WeekIntentionsBanner intentions={intentions?.intentions ?? null} />

      <div className="flex items-center rounded-xl px-4 py-4 bg-bg-elevated">
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-sm font-body text-text-tertiary">
            Tasks this week
          </span>
          <span className="font-mono text-3xl text-text-primary">
            {totalCompleted}/{totalTasks}
          </span>
        </div>

        <div className="self-stretch w-px mx-4 bg-border-subtle" />

        <div className="flex flex-col gap-0.5 flex-1 text-right">
          <span className="text-sm font-body text-text-tertiary">
            Habit consistency
          </span>
          <span className="font-mono text-3xl text-text-primary">
            {stats.habitConsistency}%
          </span>
        </div>
      </div>

      {areaBreakdown.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {areaBreakdown.map((area) => {
            const { completed, total } = stats.tasksByArea[area];
            const config = AREA_CONFIG[area];
            return (
              <span
                key={area}
                className="text-sm font-medium font-body px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: config.subtle,
                  color: config.text,
                }}
              >
                {config.label} {completed}/{total}
              </span>
            );
          })}
        </div>
      )}

      <WeeklyGoalList
        initialGoals={weeklyGoals}
        quarterlyGoals={quarterlyGoals}
        weeklyGoalLimit={weeklyGoalLimit}
      />

      <WeeklyTasksSection initialTasks={weeklyTasks} weekStart={weekStart} />

      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setIsReviewOpen(true)}
          disabled={!isSunday}
          className="w-full min-h-11 rounded-xl py-3.5 text-base font-medium transition-opacity active:opacity-70 disabled:opacity-40 bg-[var(--color-text-primary)] text-[var(--color-bg-base)]"
        >
          Start Weekly Review
        </button>
        {!isSunday && (
          <p className="text-center text-sm font-body text-text-tertiary">
            Available on Sundays
          </p>
        )}
      </div>

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
