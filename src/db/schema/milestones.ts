import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { milestoneSourceEnum } from "./enums";
import { goals } from "./goals";

export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  goalId: uuid("goal_id")
    .notNull()
    .references(() => goals.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  targetDate: text("target_date").notNull(),
  weekOffset: integer("week_offset").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  source: milestoneSourceEnum("source").notNull().default("ai"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export type MilestoneModel = typeof milestones.$inferSelect;
export type NewMilestoneModel = typeof milestones.$inferInsert;
