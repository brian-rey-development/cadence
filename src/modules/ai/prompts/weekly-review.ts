import { z } from "zod";
import type { WeeklyStats } from "@/modules/reviews/queries/get-weekly-stats";

export const weeklyReviewSchema = z.object({
  suggestions: z.array(z.string()).max(3),
  intentions: z.string(),
});

export type WeeklyReviewResponse = z.infer<typeof weeklyReviewSchema>;

type BuildPromptInput = {
  wins: string;
  blockers: string;
  goals: Array<{ title: string; area: string }>;
  stats: WeeklyStats;
};

export function buildPrompt({
  wins,
  blockers,
  goals,
  stats,
}: BuildPromptInput): string {
  const goalsList =
    goals.length > 0
      ? goals.map((g) => `- "${g.title}" (${g.area})`).join("\n")
      : "No active goals.";

  const statsSummary = Object.entries(stats.tasksByArea)
    .map(([area, s]) => `${area}: ${s.completed}/${s.total} tasks completed`)
    .join(", ");

  return `You are a productivity coach for Cadence, a personal task management app.

Based on the user's weekly review, provide 2-3 actionable suggestions for next week and generate a concise intentions statement.

Weekly stats: ${statsSummary}
Habit consistency: ${stats.habitConsistency}%
Zombie tasks (postponed 2+ times): ${stats.zombieCount}

Active goals:
${goalsList}

Wins this week:
${wins || "None provided."}

Blockers this week:
${blockers || "None provided."}

Rules:
- suggestions: 2-3 specific, actionable items for next week based on patterns observed
- intentions: 1-2 sentences summarizing focus and energy for next week, written in first person
- Be honest about patterns, not just encouraging
- Connect suggestions to the actual data and goals provided`;
}
