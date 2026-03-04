import { relations } from "drizzle-orm";
import { aiGoalBreakdowns, aiTaskScores } from "./ai-engine";
import { goals } from "./goals";
import { habitLogs, habits } from "./habits";
import { tasks } from "./tasks";

export const tasksRelations = relations(tasks, ({ one }) => ({
  goal: one(goals, {
    fields: [tasks.goalId],
    references: [goals.id],
  }),
  score: one(aiTaskScores, {
    fields: [tasks.id],
    references: [aiTaskScores.taskId],
  }),
}));

export const goalsRelations = relations(goals, ({ many, one }) => ({
  tasks: many(tasks),
  breakdown: one(aiGoalBreakdowns, {
    fields: [goals.id],
    references: [aiGoalBreakdowns.goalId],
  }),
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

export const aiTaskScoresRelations = relations(aiTaskScores, ({ one }) => ({
  task: one(tasks, {
    fields: [aiTaskScores.taskId],
    references: [tasks.id],
  }),
}));

export const aiGoalBreakdownsRelations = relations(
  aiGoalBreakdowns,
  ({ one }) => ({
    goal: one(goals, {
      fields: [aiGoalBreakdowns.goalId],
      references: [goals.id],
    }),
  }),
);
