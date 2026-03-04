import { relations } from "drizzle-orm";
import { goals } from "./goals";
import { habitLogs, habits } from "./habits";
import { tasks } from "./tasks";

export const tasksRelations = relations(tasks, ({ one }) => ({
  goal: one(goals, {
    fields: [tasks.goalId],
    references: [goals.id],
  }),
}));

export const goalsRelations = relations(goals, ({ many }) => ({
  tasks: many(tasks),
}));

export const habitsRelations = relations(habits, ({ many }) => ({
  logs: many(habitLogs),
}));

export const habitLogsRelations = relations(habitLogs, ({ one }) => ({
  habit: one(habits, {
    fields: [habitLogs.habitId],
    references: [habits.id],
  }),
}));
