import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { areaEnum } from "./enums";

export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  area: areaEnum("area").notNull(),
  weeklyFrequency: integer("weekly_frequency").notNull().default(7),
  scheduledTime: text("scheduled_time"), // "HH:MM" local time; nullable
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export const habitLogs = pgTable("habit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  habitId: uuid("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // ISO date string "YYYY-MM-DD"
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export type HabitModel = typeof habits.$inferSelect;
export type NewHabitModel = typeof habits.$inferInsert;
export type HabitLogModel = typeof habitLogs.$inferSelect;
export type NewHabitLogModel = typeof habitLogs.$inferInsert;
