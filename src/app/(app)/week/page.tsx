import { requireAuth } from "@/modules/auth/utils";
import { getWeeklyGoals } from "@/modules/goals/queries/get-weekly-goals";
import { getWeekIntentions } from "@/modules/reviews/queries/get-week-intentions";
import { getWeeklyStats } from "@/modules/reviews/queries/get-weekly-stats";
import { getActiveGoals } from "@/modules/tasks/queries/get-active-goals";
import { getWeeklyTasks } from "@/modules/tasks/queries/get-weekly-tasks";
import { weekStart } from "@/shared/utils/week";
import WeekClient from "./week-client";

export default async function Page() {
  const session = await requireAuth();
  const userId = session.id;

  const start = weekStart();

  const [stats, intentions, quarterlyGoals, weeklyTasks, weeklyGoals] =
    await Promise.all([
      getWeeklyStats(userId, start),
      getWeekIntentions(userId, start),
      getActiveGoals(userId),
      getWeeklyTasks(userId, start),
      getWeeklyGoals(userId, start),
    ]);

  return (
    <WeekClient
      stats={stats}
      intentions={intentions}
      goals={quarterlyGoals}
      weekStart={start}
      weeklyTasks={weeklyTasks}
      weeklyGoals={weeklyGoals}
    />
  );
}
