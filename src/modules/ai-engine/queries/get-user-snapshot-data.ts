import { and, desc, eq, gte, isNull } from "drizzle-orm";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import { habitLogs, habits } from "@/db/schema/habits";
import { dailyReviews, weeklyReviews } from "@/db/schema/reviews";
import { tasks } from "@/db/schema/tasks";

const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;
const REVIEWS_LIMIT = 4;

export type UserSnapshotData = {
  activeGoals: Array<{
    id: string;
    title: string;
    area: string;
    quarter: string;
  }>;
  recentTasks: Array<{
    title: string;
    status: string;
    area: string;
    date: string | null;
  }>;
  habitSummary: Array<{ name: string; logCount: number }>;
  recentDailyReviews: Array<{ date: string; reflection: string | null }>;
  recentWeeklyReviews: Array<{
    weekStart: string;
    wins: string | null;
    blockers: string | null;
  }>;
};

export async function getUserSnapshotData(
  userId: string,
): Promise<UserSnapshotData> {
  const cutoff = new Date(Date.now() - DAYS_30_MS).toISOString().slice(0, 10);

  const [
    activeGoals,
    recentTasks,
    habitRows,
    habitLogRows,
    dailyReviewRows,
    weeklyReviewRows,
  ] = await Promise.all([
    db
      .select({
        id: goals.id,
        title: goals.title,
        area: goals.area,
        quarter: goals.quarter,
      })
      .from(goals)
      .where(and(eq(goals.userId, userId), eq(goals.status, "active"))),
    db
      .select({
        title: tasks.title,
        status: tasks.status,
        area: tasks.area,
        date: tasks.date,
      })
      .from(tasks)
      .where(and(eq(tasks.userId, userId), gte(tasks.date, cutoff)))
      .orderBy(desc(tasks.createdAt)),
    db
      .select({ id: habits.id, name: habits.name })
      .from(habits)
      .where(and(eq(habits.userId, userId), isNull(habits.archivedAt))),
    db
      .select({ habitId: habitLogs.habitId })
      .from(habitLogs)
      .where(and(eq(habitLogs.userId, userId), gte(habitLogs.date, cutoff))),
    db
      .select({ date: dailyReviews.date, reflection: dailyReviews.reflection })
      .from(dailyReviews)
      .where(eq(dailyReviews.userId, userId))
      .orderBy(desc(dailyReviews.createdAt))
      .limit(REVIEWS_LIMIT),
    db
      .select({
        weekStart: weeklyReviews.weekStart,
        wins: weeklyReviews.wins,
        blockers: weeklyReviews.blockers,
      })
      .from(weeklyReviews)
      .where(eq(weeklyReviews.userId, userId))
      .orderBy(desc(weeklyReviews.createdAt))
      .limit(REVIEWS_LIMIT),
  ]);

  const logCountByHabit: Record<string, number> = {};
  for (const row of habitLogRows) {
    logCountByHabit[row.habitId] = (logCountByHabit[row.habitId] ?? 0) + 1;
  }

  const habitSummary = habitRows.map((h) => ({
    name: h.name,
    logCount: logCountByHabit[h.id] ?? 0,
  }));

  return {
    activeGoals,
    recentTasks,
    habitSummary,
    recentDailyReviews: dailyReviewRows,
    recentWeeklyReviews: weeklyReviewRows,
  };
}
