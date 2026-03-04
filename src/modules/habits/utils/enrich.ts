import type { HabitWithLogs, HabitWithStats } from "../habits.types";
import { buildHeatmapData } from "./heatmap";
import { currentStreak, longestStreak } from "./streak";

export function enrichHabit(habit: HabitWithLogs): HabitWithStats {
  return {
    ...habit,
    streak: {
      current: currentStreak(habit.logs),
      longest: longestStreak(habit.logs),
    },
    heatmap: buildHeatmapData(habit.logs),
  };
}

export function sortByLogStatus(
  habits: HabitWithStats[],
  todayStr: string,
): HabitWithStats[] {
  return [...habits].sort((a, b) => {
    const aLogged = a.logs.some((l) => l.date === todayStr) ? 1 : 0;
    const bLogged = b.logs.some((l) => l.date === todayStr) ? 1 : 0;
    return aLogged - bLogged;
  });
}
