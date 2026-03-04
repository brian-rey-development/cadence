import { requireAuth } from "@/modules/auth/utils";
import HabitSummaryBar from "@/modules/habits/components/habit-summary-bar";
import { getHabitSummaryToday } from "@/modules/habits/queries/get-habit-summary-today";
import DailyLimitBanner from "@/modules/tasks/components/daily-limit-banner";
import TaskList from "@/modules/tasks/components/task-list";
import { getTasksForDay } from "@/modules/tasks/queries/get-tasks-for-day";
import { today } from "@/shared/utils/date";

export default async function TodayPage() {
  const session = await requireAuth();
  const userId = session.user.id;
  const date = today();

  const [tasks, habitSummary] = await Promise.all([
    getTasksForDay(userId, date),
    getHabitSummaryToday(userId, date),
  ]);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <header className="flex items-baseline justify-between">
        <h1
          className="font-['Fraunces'] text-xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          today
        </h1>
        <DailyLimitBanner tasks={tasks} />
      </header>

      <TaskList initialTasks={tasks} date={date} />

      <HabitSummaryBar
        total={habitSummary.total}
        completed={habitSummary.completed}
      />
    </div>
  );
}
