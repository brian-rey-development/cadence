import type { GoalModel, TaskModel } from "@/db/schema";

export type Goal = GoalModel;
export type NewGoal = Omit<GoalModel, "id" | "createdAt" | "updatedAt">;
export type GoalWithTasks = Goal & { tasks: TaskModel[] };
export type GoalWithProgress = GoalWithTasks & { progress: number };
