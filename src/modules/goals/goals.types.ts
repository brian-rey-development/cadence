import type { GoalModel, MilestoneModel, TaskModel } from "@/db/schema";

export type Goal = GoalModel;
export type NewGoal = Omit<GoalModel, "id" | "createdAt" | "updatedAt">;
export type GoalWithTasks = Goal & { tasks: TaskModel[] };
export type GoalWithMilestones = GoalWithTasks & {
  milestones: MilestoneModel[];
};
export type GoalWithProgress = GoalWithMilestones & { progress: number };
export type GoalWithParent = Goal & { parentGoal: Goal | null };
export type GoalWithTasksAndParent = GoalWithTasks & {
  parentGoal: Goal | null;
};
