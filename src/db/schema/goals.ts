import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { areaEnum, goalStatusEnum } from "./enums";

export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  area: areaEnum("area").notNull(),
  description: text("description"),
  quarter: text("quarter").notNull(), // format: "2026-Q1"
  status: goalStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export type GoalModel = typeof goals.$inferSelect;
export type NewGoalModel = typeof goals.$inferInsert;
