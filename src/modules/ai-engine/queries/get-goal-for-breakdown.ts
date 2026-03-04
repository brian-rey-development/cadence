import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import { tasks } from "@/db/schema/tasks";

export type GoalForBreakdown = {
  id: string;
  title: string;
  description: string | null;
  area: string;
  quarter: string;
  tasks: Array<{ id: string; title: string; status: string }>;
};

export async function getGoalForBreakdown(
  userId: string,
  goalId: string,
): Promise<GoalForBreakdown | null> {
  const [goal] = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));

  if (!goal) return null;

  const goalTasks = await db
    .select({ id: tasks.id, title: tasks.title, status: tasks.status })
    .from(tasks)
    .where(and(eq(tasks.goalId, goalId), eq(tasks.userId, userId)));

  return { ...goal, tasks: goalTasks };
}
