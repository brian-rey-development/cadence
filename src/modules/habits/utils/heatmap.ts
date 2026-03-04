import { HABIT_HEATMAP_DAYS } from "@/shared/config/constants";
import { toISODate } from "@/shared/utils/date";
import type { HabitLog, HeatmapDay } from "../habits.types";

export function buildHeatmapData(
  logs: HabitLog[],
  days = HABIT_HEATMAP_DAYS,
): HeatmapDay[] {
  const logged = new Set(logs.map((l) => l.date));
  const result: HeatmapDay[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const date = toISODate(d);
    result.push({ date, logged: logged.has(date) });
  }

  return result;
}
