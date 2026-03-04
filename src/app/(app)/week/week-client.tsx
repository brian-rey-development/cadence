"use client";

import { useState } from "react";
import type { GoalModel } from "@/db/schema/goals";
import type { WeeklyReviewModel } from "@/db/schema/reviews";
import WeekIntentionsBanner from "@/modules/reviews/components/week-intentions-banner";
import WeeklyReviewSheet from "@/modules/reviews/components/weekly-review-sheet";
import type { WeeklyStats } from "@/modules/reviews/queries/get-weekly-stats";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS } from "@/shared/config/constants";

type WeekClientProps = {
  stats: WeeklyStats;
  intentions: WeeklyReviewModel | undefined;
  goals: GoalModel[];
  weekStart: string;
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

  const areaBreakdown = AREAS.filter(
    (area) => stats.tasksByArea[area]?.total > 0,
  );

  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      <header>
        <h1
          className="font-['Fraunces'] text-2xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Week
        </h1>
        <p
          className="text-[13px] font-['DM_Sans']"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {formatWeekRange(weekStart)}
        </p>
      </header>

      <WeekIntentionsBanner intentions={intentions?.intentions ?? null} />

      <div
        className="flex items-center rounded-xl px-4 py-4"
        style={{ backgroundColor: "var(--color-bg-elevated)" }}
      >
        <div className="flex flex-col gap-0.5 flex-1">
          <span
            className="text-xs font-['DM_Sans']"
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

        <div
          className="self-stretch w-px mx-4"
          style={{ backgroundColor: "var(--color-border-subtle)" }}
        />

        <div className="flex flex-col gap-0.5 flex-1 text-right">
          <span
            className="text-xs font-['DM_Sans']"
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

      {areaBreakdown.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {areaBreakdown.map((area) => {
            const { completed, total } = stats.tasksByArea[area];
            const config = AREA_CONFIG[area];
            return (
              <span
                key={area}
                className="text-[11px] font-medium font-['DM_Sans'] px-2.5 py-1 rounded-full"
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
