import { requireAuth } from "@/modules/auth/utils";
import GoalList from "@/modules/goals/components/goal-list";
import { getGoalsForQuarter } from "@/modules/goals/queries/get-goals-for-quarter";
import {
  currentQuarter,
  formatQuarterLabel,
} from "@/modules/goals/utils/goal-utils";

export default async function QuarterPage() {
  const session = await requireAuth();
  const goals = await getGoalsForQuarter(session.id);
  const quarterLabel = formatQuarterLabel(currentQuarter());

  return (
    <main className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <GoalList initialData={goals} currentQuarterLabel={quarterLabel} />
    </main>
  );
}
