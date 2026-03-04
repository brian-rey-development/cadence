import { getTaskScores } from "@/modules/ai-engine/queries/get-task-scores";
import { requireAuth } from "@/modules/auth/utils";
import HabitSummaryBar from "@/modules/habits/components/habit-summary-bar";
import { getHabitSummaryToday } from "@/modules/habits/queries/get-habit-summary-today";
import DailyLimitBanner from "@/modules/tasks/components/daily-limit-banner";
import TaskList from "@/modules/tasks/components/task-list";
import { getTasksForDay } from "@/modules/tasks/queries/get-tasks-for-day";
import { today } from "@/shared/utils/date";
import TodayClient from "./today-client";

export default async function TodayPage() {
  const session = await requireAuth();
  const userId = session.id;
  const date = today();

  const [tasks, habitSummary] = await Promise.all([
    getTasksForDay(userId, date),
    getHabitSummaryToday(userId, date),
  ]);

  const scores = await getTaskScores(
    userId,
    tasks.map((t) => t.id),
  );

  return (
    <TodayClient tasks={tasks} date={date}>
      <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
        <header className="flex items-start justify-between">
          <div>
            <h1
              className="font-['Fraunces'] text-2xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Today
            </h1>
            <p
              className="text-[13px] font-['DM_Sans']"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <DailyLimitBanner tasks={tasks} />
        </header>

        <TaskList initialTasks={tasks} initialScores={scores} date={date} />

        <div style={{ borderTop: "1px solid var(--color-border-subtle)" }} />

        <HabitSummaryBar
          total={habitSummary.total}
          completed={habitSummary.completed}
        />
      </div>
    </TodayClient>
  );
}
