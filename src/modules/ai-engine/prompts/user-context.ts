import { z } from "zod";
import type { UserSnapshotData } from "../queries/get-user-snapshot-data";

export const userContextSchema = z.object({
  snapshot: z
    .string()
    .describe(
      "~500 word compressed summary of the user's goals, patterns, and behavioral profile",
    ),
});

export type UserContextResponse = z.infer<typeof userContextSchema>;

export function buildPrompt(data: UserSnapshotData): string {
  const goals = data.activeGoals
    .map((g) => `- [${g.area}] "${g.title}" (${g.quarter})`)
    .join("\n");

  const taskBreakdown = (() => {
    const counts: Record<string, number> = {};
    for (const t of data.recentTasks) {
      counts[t.status] = (counts[t.status] ?? 0) + 1;
    }
    return Object.entries(counts)
      .map(([s, n]) => `${n} ${s}`)
      .join(", ");
  })();

  const habits = data.habitSummary
    .map((h) => `- ${h.name}: ${h.logCount} logs (last 30d)`)
    .join("\n");

  const reviews = data.recentDailyReviews
    .filter((r) => r.reflection)
    .map((r) => `[${r.date}] ${r.reflection}`)
    .join("\n");

  return `You are a behavioral analyst for Cadence, a personal productivity app.

Write a compressed, dense user profile (~500 words) based on the data below. This profile will be used as RAG context for future AI decisions — it should capture patterns, strengths, recurring blockers, and goal alignment.

Active goals:
${goals || "None"}

Recent task activity (last 30 days):
${taskBreakdown || "No tasks"}

Habit consistency (last 30 days):
${habits || "No habits tracked"}

Recent reflections:
${reviews || "No reflections yet"}

Write the profile in second person ("You tend to...", "Your strongest area is..."). Be specific, pattern-focused, and honest about gaps. Do not be generic.`;
}
