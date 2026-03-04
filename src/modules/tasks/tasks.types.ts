import type { GoalModel, TaskModel } from "@/db/schema";

export type Task = TaskModel;
export type NewTask = Omit<TaskModel, "id" | "createdAt" | "updatedAt">;
export type TaskWithGoal = Task & { goal: GoalModel | null };
