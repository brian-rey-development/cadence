import { z } from "zod";

export const zombieCheckSchema = z.object({
  suggestedTitle: z
    .string()
    .describe("Reformulated task title: specific, actionable, achievable"),
  reasoning: z
    .string()
    .describe("Brief explanation of why this reformulation helps"),
});

export type ZombieCheckResponse = z.infer<typeof zombieCheckSchema>;

type Goal = {
  id: string;
  title: string;
};

type BuildPromptInput = {
  originalTitle: string;
  area: string;
  daysSinceCreated: number;
  goals: Goal[];
  userContext?: string | null;
};

export function buildPrompt({
  originalTitle,
  area,
  daysSinceCreated,
  goals,
  userContext,
}: BuildPromptInput): string {
  const goalsList =
    goals.length > 0
      ? goals.map((g) => `- ${g.title}`).join("\n")
      : "No active goals.";

  const userBlock = userContext ? `${userContext}\n\n` : "";

  return `You are a productivity assistant helping the user fix a stalled task in Cadence.

${userBlock}

This task has been postponed for ${daysSinceCreated} days without completion. It may be too vague, too large, or unclear.

Original title: "${originalTitle}"
Area: ${area}
Active goals:
${goalsList}

Reformulate the task title to make it specific, concrete, and achievable in a single session. Start with a clear action verb. Keep it under 10 words if possible.`;
}
