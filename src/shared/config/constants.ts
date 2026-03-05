export const DAILY_TASK_LIMIT = 7;
export const HABIT_HEATMAP_DAYS = 28;
export const HABIT_CONSISTENCY_DAYS = 7;
export const DAILY_TASK_SOFT_WARNING = 5;
export const ZOMBIE_DAYS = 2;
export const MAX_GOALS_PER_AREA = 3;
export const AREAS = ["work", "personal", "identity"] as const;
export const CLOSE_DAY_AFTER_HOUR = 18;
export const MIN_PASSWORD_LENGTH = 6;

export type Area = (typeof AREAS)[number];
