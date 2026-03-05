import DailyQuote from "@/modules/ai/components/daily-quote";
import { getTaskScores } from "@/modules/ai-engine/queries/get-task-scores";
import { requireAuth } from "@/modules/auth/utils";
import HabitList from "@/modules/habits/components/habit-list";
import { getHabitsWithLogs } from "@/modules/habits/queries/get-habits-with-logs";
import { getUserSettings } from "@/modules/settings/queries/get-user-settings";
import TaskList from "@/modules/tasks/components/task-list";
import TodayHeader from "@/modules/tasks/components/today-header";
import { getTasksForDay } from "@/modules/tasks/queries/get-tasks-for-day";
import {
  CLOSE_DAY_AFTER_HOUR,
  DAILY_TASK_LIMIT,
} from "@/shared/config/constants";
import { today } from "@/shared/utils/date";
import TodayClient from "./today-client";

export default async function TodayPage() {
  const user = await requireAuth();
  const userId = user.id;
  const date = today();

  const [tasks, habits, settings] = await Promise.all([
    getTasksForDay(userId, date),
    getHabitsWithLogs(userId, date),
    getUserSettings(userId),
  ]);

  const scores = await getTaskScores(
    userId,
    tasks.map((t) => t.id),
  );

  const displayName =
    settings?.aiDisplayName ??
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "there";

  const closeDayAfterHour = settings?.closeDayAfterHour ?? CLOSE_DAY_AFTER_HOUR;
  const dailyTaskLimit = settings?.dailyTaskLimit ?? DAILY_TASK_LIMIT;

  return (
    <TodayClient
      tasks={tasks}
      date={date}
      closeDayAfterHour={closeDayAfterHour}
    >
      <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
        <TodayHeader
          displayName={displayName}
          date={date}
          tasks={tasks}
          dailyTaskLimit={dailyTaskLimit}
        />

        <DailyQuote />

        <TaskList initialTasks={tasks} initialScores={scores} date={date} />

        <div className="border-t border-border-subtle" />

        <HabitList initialData={habits} />
      </div>
    </TodayClient>
  );
}
