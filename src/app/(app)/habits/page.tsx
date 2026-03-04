import { requireAuth } from "@/modules/auth/utils";
import HabitList from "@/modules/habits/components/habit-list";
import HabitSummaryHeader from "@/modules/habits/components/habit-summary-header";
import { getHabitsWithLogs } from "@/modules/habits/queries/get-habits-with-logs";
import { weeklyConsistency } from "@/modules/habits/utils/consistency";
import { HABIT_HEATMAP_DAYS } from "@/shared/config/constants";
import { toISODate } from "@/shared/utils/date";

export default async function HabitsPage() {
  const session = await requireAuth();

  const startDate = toISODate(
    new Date(Date.now() - (HABIT_HEATMAP_DAYS - 1) * 24 * 60 * 60 * 1000),
  );

  const habits = await getHabitsWithLogs(session.user.id, startDate);
  const consistency = weeklyConsistency(habits);

  return (
    <main className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <HabitSummaryHeader consistency={consistency} />
      <HabitList initialData={habits} />
    </main>
  );
}
