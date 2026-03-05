import { requireAuth } from "@/modules/auth/utils";
import GoalList from "@/modules/goals/components/goal-list";
import { getGoalsForQuarter } from "@/modules/goals/queries/get-goals-for-quarter";
import {
  currentQuarter,
  formatQuarterLabel,
} from "@/modules/goals/utils/goal-utils";
import QuarterlyTasksSection from "@/modules/tasks/components/quarterly-tasks-section";
import { getQuarterlyTasks } from "@/modules/tasks/queries/get-quarterly-tasks";

export default async function QuarterPage() {
  const session = await requireAuth();
  const [goals, quarterlyTasks] = await Promise.all([
    getGoalsForQuarter(session.id),
    getQuarterlyTasks(session.id),
  ]);
  const quarterLabel = formatQuarterLabel(currentQuarter());

  return (
    <main className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <header>
        <h1 className="font-display text-2xl text-text-primary">Goals</h1>
      </header>
      <QuarterlyTasksSection initialTasks={quarterlyTasks} />
      <GoalList initialData={goals} currentQuarterLabel={quarterLabel} />
    </main>
  );
}
