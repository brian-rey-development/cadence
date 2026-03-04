import type { HabitLogModel, HabitModel } from "@/db/schema";

export type Habit = HabitModel;
export type NewHabit = Omit<HabitModel, "id" | "createdAt">;
export type HabitLog = HabitLogModel;
export type HabitWithLogs = Habit & { logs: HabitLog[] };
