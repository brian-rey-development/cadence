import { z } from "zod";
import type { Area } from "@/shared/config/constants";

export const refineHabitSchema = z.object({
  insight: z
    .string()
    .describe(
      "1-2 sentences. Sharp observation on specificity (is the action measurable?) or frequency realism. No fluff.",
    ),
  trigger: z
    .string()
    .describe(
      'Implementation intention: "After [existing daily routine], I will [specific action]." Cue must be a real daily event.',
    ),
  identityStatement: z
    .string()
    .describe(
      'Complete the sentence starting with "I\'m becoming someone who..." — grounded in the action, not aspirational hype.',
    ),
});

export type HabitFeedback = z.infer<typeof refineHabitSchema>;

type BuildPromptInput = {
  name: string;
  area: Area;
  weeklyFrequency: number;
};

export function buildPrompt({ name, area, weeklyFrequency }: BuildPromptInput): string {
  const frequencyLabel =
    weeklyFrequency === 7 ? "daily" : `${weeklyFrequency}x per week`;

  return `You are a habit coach for Cadence, a personal productivity app.

The user wants to track a new habit:
- Name: "${name}"
- Area: ${area}
- Target frequency: ${frequencyLabel}

Analyze this habit and return three things:

1. insight: One sharp, direct observation. Focus on: Is the action specific enough to track objectively? Is the frequency realistic for this type of habit? What is the most likely failure mode? No motivational language. 1-2 sentences max.

2. trigger: Write one implementation intention in this exact format: "After [specific daily cue], I will [action]." The cue must be a concrete existing routine (waking up, morning coffee, lunch, finishing work, dinner, before bed, etc.). Make the action match the habit name exactly or closely.

3. identityStatement: Complete this sentence — "I'm becoming someone who ___." Ground it in the actual behavior, not a vague aspiration.

Rules:
- If the habit already has a number, duration, or clear action verb, acknowledge the specificity briefly
- If frequency is daily (7) and the habit is physically demanding or requires focused effort, flag it — recommend starting at 3-5x to build the pattern first
- Never use phrases like "Great choice", "Love it", "Amazing", or any motivational filler
- Be a coach who tells the truth in plain language
- Keep everything short`;
}
