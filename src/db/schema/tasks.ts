import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { areaEnum, taskStatusEnum, taskTypeEnum } from "./enums";
import { goals } from "./goals";
import { milestones } from "./milestones";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  area: areaEnum("area").notNull(),
  type: taskTypeEnum("type").notNull().default("daily"),
  date: text("date"), // ISO date string "YYYY-MM-DD"; null for quarterly tasks
  weekStart: text("week_start"), // "YYYY-MM-DD" Monday; required when type = "weekly"
  status: taskStatusEnum("status").notNull().default("pending"),
  goalId: uuid("goal_id").references(() => goals.id, { onDelete: "set null" }),
  milestoneId: uuid("milestone_id").references(() => milestones.id, {
    onDelete: "set null",
  }),
  postponeCount: integer("postpone_count").notNull().default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export type TaskModel = typeof tasks.$inferSelect;
export type NewTaskModel = typeof tasks.$inferInsert;
