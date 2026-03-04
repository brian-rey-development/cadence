export const DAILY_TASK_LIMIT = 7;
export const DAILY_TASK_SOFT_WARNING = 5;
export const ZOMBIE_DAYS = 2;
export const MAX_GOALS_PER_AREA = 3;
export const AREAS = ["work", "personal", "identity"] as const;
export const CLOSE_DAY_AFTER_HOUR = 18;

export type Area = (typeof AREAS)[number];
