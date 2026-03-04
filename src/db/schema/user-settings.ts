import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userSettings = pgTable("user_settings", {
  userId: uuid("user_id").primaryKey(),
  morningNotificationTime: text("morning_notification_time"), // "HH:MM" local time
  eveningNotificationTime: text("evening_notification_time"), // "HH:MM" local time
  timezone: text("timezone").notNull().default("UTC"),
  morningEnabled: boolean("morning_enabled").notNull().default(false),
  eveningEnabled: boolean("evening_enabled").notNull().default(false),
  pushSubscription: text("push_subscription"), // JSON-stringified PushSubscriptionJSON
  lastMorningSentDate: text("last_morning_sent_date"), // "YYYY-MM-DD"
  lastEveningSentDate: text("last_evening_sent_date"), // "YYYY-MM-DD"
  // AI profile fields
  aiDisplayName: text("ai_display_name"),
  aiRole: text("ai_role"),
  aiAbout: text("ai_about"),
  aiWorkStyle: text("ai_work_style"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export type UserSettingsModel = typeof userSettings.$inferSelect;
export type NewUserSettingsModel = typeof userSettings.$inferInsert;
