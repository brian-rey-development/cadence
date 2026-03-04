import { z } from "zod";
import type { TaskForScoring } from "../queries/get-tasks-for-scoring";

export const taskScoreSchema = z.object({
  scores: z.array(
    z.object({
      taskId: z.string().describe("ID of the scored task"),
      impactScore: z
        .number()
        .min(0)
        .max(1)
        .describe("Goal alignment strength — 0.00 to 1.00"),
      urgencyScore: z
        .number()
        .min(0)
        .max(1)
        .describe("Time pressure — 0.00 to 1.00"),
      opportunityCost: z
        .array(z.string())
        .describe("IDs of tasks being deferred by prioritizing this one"),
      reasoning: z
        .string()
        .describe("One sentence explaining the score, shown in tooltip"),
    }),
  ),
});

export type ScoreTasksResponse = z.infer<typeof taskScoreSchema>;

type BuildPromptInput = {
  tasks: TaskForScoring[];
  goals: Array<{ id: string; title: string; area: string }>;
  ragContext: string;
  today: string;
};

export function buildPrompt({
  tasks,
  goals,
  ragContext,
  today,
}: BuildPromptInput): string {
  const taskList = tasks
    .map(
      (t) =>
        `- id:${t.id} | "${t.title}" | area:${t.area} | date:${t.date} | postponed:${t.postponeCount}x | goal:${t.goalTitle ?? "none"}`,
    )
    .join("\n");

  const goalList =
    goals.length > 0
      ? goals.map((g) => `- id:${g.id} | "${g.title}" | ${g.area}`).join("\n")
      : "No active goals.";

  return `You are a productivity intelligence layer for Cadence, a personal task management app.

Score each pending task by impact (goal alignment) and urgency (time pressure). Identify opportunity costs — other tasks that would be deferred by prioritizing each one.

Today: ${today}

Active goals:
${goalList}

Pending tasks:
${taskList}

Relevant context from user history:
${ragContext || "No additional context available."}

Rules:
- impactScore: 1.0 = task directly advances a core goal, 0.0 = no goal connection
- urgencyScore: 1.0 = overdue or time-critical, 0.0 = flexible/evergreen
- opportunityCost: list 1-3 task IDs that compete for the same time/energy slot
- reasoning: one clear sentence (≤20 words) explaining the combined score
- Score every task in the input — never omit one
- Be decisive, not hedging`;
}
