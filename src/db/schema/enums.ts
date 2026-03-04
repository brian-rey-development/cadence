import { pgEnum } from "drizzle-orm/pg-core";

export const areaEnum = pgEnum("area", ["work", "personal", "identity"]);
export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "completed",
  "archived",
]);
export const goalStatusEnum = pgEnum("goal_status", [
  "active",
  "achieved",
  "abandoned",
]);
export const taskTypeEnum = pgEnum("task_type", [
  "daily",
  "weekly",
  "quarterly",
]);
