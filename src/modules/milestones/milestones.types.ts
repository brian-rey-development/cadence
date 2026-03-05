import type { MilestoneModel, TaskModel } from "@/db/schema";

export type Milestone = MilestoneModel;
export type NewMilestone = Omit<
  MilestoneModel,
  "id" | "createdAt" | "updatedAt"
>;
export type MilestoneWithTasks = Milestone & { tasks: TaskModel[] };
