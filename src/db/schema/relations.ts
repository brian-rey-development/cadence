import { relations } from "drizzle-orm";
import { aiGoalBreakdowns, aiTaskScores } from "./ai-engine";
import { goals } from "./goals";
import { habitLogs, habits } from "./habits";
import { milestones } from "./milestones";
import { tasks } from "./tasks";

export const tasksRelations = relations(tasks, ({ one }) => ({
  goal: one(goals, {
    fields: [tasks.goalId],
    references: [goals.id],
  }),
  milestone: one(milestones, {
    fields: [tasks.milestoneId],
    references: [milestones.id],
  }),
  score: one(aiTaskScores, {
    fields: [tasks.id],
    references: [aiTaskScores.taskId],
  }),
}));

export const goalsRelations = relations(goals, ({ many, one }) => ({
  tasks: many(tasks),
  milestones: many(milestones),
  breakdown: one(aiGoalBreakdowns, {
    fields: [goals.id],
    references: [aiGoalBreakdowns.goalId],
  }),
  parentGoal: one(goals, {
    fields: [goals.parentGoalId],
    references: [goals.id],
    relationName: "parentGoal",
  }),
  childGoals: many(goals, { relationName: "parentGoal" }),
}));

export const milestonesRelations = relations(milestones, ({ one, many }) => ({
  goal: one(goals, {
    fields: [milestones.goalId],
    references: [goals.id],
  }),
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
