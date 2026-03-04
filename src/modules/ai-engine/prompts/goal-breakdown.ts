import { z } from "zod";
import type { GoalForBreakdown } from "../queries/get-goal-for-breakdown";

export const milestoneSchema = z.object({
  title: z.string().describe("Clear milestone title"),
  targetDate: z.string().describe("ISO date YYYY-MM-DD"),
  suggestedTasks: z
    .array(z.string())
    .describe("2-4 concrete task titles needed to reach this milestone"),
  weekOffset: z
    .number()
    .int()
    .describe("Weeks from today when this milestone should be reached"),
});

export const goalBreakdownSchema = z.object({
  milestones: z
    .array(milestoneSchema)
    .describe("3-6 ordered milestones that build toward the goal"),
});

export type GoalBreakdownResponse = z.infer<typeof goalBreakdownSchema>;

type BuildPromptInput = {
  goal: GoalForBreakdown;
  ragContext: string;
  today: string;
};

export function buildPrompt({
  goal,
  ragContext,
  today,
}: BuildPromptInput): string {
  const existingTasks =
    goal.tasks.length > 0
      ? goal.tasks.map((t) => `- [${t.status}] ${t.title}`).join("\n")
      : "No tasks yet.";

  return `You are a strategic planning assistant for Cadence.

Break the following goal into concrete milestones with suggested tasks. Consider what the user has already done.

Today: ${today}
Goal quarter: ${goal.quarter}

Goal: "${goal.title}"
Area: ${goal.area}
Description: ${goal.description ?? "No description provided."}

Existing tasks linked to this goal:
${existingTasks}

Relevant context:
${ragContext || "No additional context available."}

Rules:
- Create 3-6 milestones, ordered chronologically
- Each milestone should be a meaningful checkpoint, not just a task list
- suggestedTasks: 2-4 specific, action-oriented task titles (sentence case, start with verb)
- targetDate must fall within the goal's quarter (${goal.quarter})
- weekOffset is relative to today (${today})
- Build on existing tasks — do not duplicate completed work`;
}
