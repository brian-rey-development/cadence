import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const reminderLogs = pgTable(
  "reminder_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    entityType: text("entity_type").notNull(), // "task" | "habit"
    entityId: uuid("entity_id").notNull(),
    sentDate: text("sent_date").notNull(), // "YYYY-MM-DD"
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique().on(t.entityId, t.sentDate)],
).enableRLS();

export type ReminderLogModel = typeof reminderLogs.$inferSelect;
