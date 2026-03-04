import type { HabitLogModel, HabitModel } from "@/db/schema";

export type Habit = HabitModel;
export type NewHabit = Omit<
  HabitModel,
  "id" | "createdAt" | "userId" | "archivedAt"
>;
export type HabitLog = HabitLogModel;
export type HabitWithLogs = Habit & { logs: HabitLog[] };

export type HeatmapDay = { date: string; logged: boolean };
export type StreakData = { current: number; longest: number };
export type HabitWithStats = HabitWithLogs & {
  streak: StreakData;
  heatmap: HeatmapDay[];
};
