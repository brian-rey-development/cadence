import { Settings } from "lucide-react";
import Link from "next/link";
import DailyQuote from "@/modules/ai/components/daily-quote";
import { getTaskScores } from "@/modules/ai-engine/queries/get-task-scores";
import { requireAuth } from "@/modules/auth/utils";
import HabitList from "@/modules/habits/components/habit-list";
import { getHabitsWithLogs } from "@/modules/habits/queries/get-habits-with-logs";
import DailyLimitBanner from "@/modules/tasks/components/daily-limit-banner";
import TaskList from "@/modules/tasks/components/task-list";
import { getTasksForDay } from "@/modules/tasks/queries/get-tasks-for-day";
import { today } from "@/shared/utils/date";
import TodayClient from "./today-client";

export default async function TodayPage() {
  const session = await requireAuth();
  const userId = session.id;
  const date = today();

  const [tasks, habits] = await Promise.all([
    getTasksForDay(userId, date),
    getHabitsWithLogs(userId, date),
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
            <h1 className="font-display text-2xl text-text-primary">Today</h1>
            <p className="text-sm font-body text-text-tertiary">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <DailyLimitBanner tasks={tasks} />
            <Link
              href="/settings"
              aria-label="Settings"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors duration-150 active:bg-[var(--color-ghost-active)] text-text-tertiary"
            >
              <Settings size={20} strokeWidth={1.5} />
            </Link>
          </div>
        </header>

        <DailyQuote />

        <TaskList initialTasks={tasks} initialScores={scores} date={date} />

        <div style={{ borderTop: "1px solid var(--color-border-subtle)" }} />

        <HabitList initialData={habits} />
      </div>
    </TodayClient>
  );
}
