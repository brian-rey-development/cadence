import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const dailyReviews = pgTable("daily_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  date: text("date").notNull(), // ISO date string "YYYY-MM-DD"
  reflection: text("reflection"),
  aiSummary: text("ai_summary"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export const weeklyReviews = pgTable("weekly_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  weekStart: text("week_start").notNull(), // ISO date string "YYYY-MM-DD"
  wins: text("wins"),
  blockers: text("blockers"),
  intentions: text("intentions"),
  aiSuggestions: text("ai_suggestions"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export type DailyReviewModel = typeof dailyReviews.$inferSelect;
export type NewDailyReviewModel = typeof dailyReviews.$inferInsert;
export type WeeklyReviewModel = typeof weeklyReviews.$inferSelect;
export type NewWeeklyReviewModel = typeof weeklyReviews.$inferInsert;
