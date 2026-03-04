import { relations } from "drizzle-orm";
import { goals } from "./goals";
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
