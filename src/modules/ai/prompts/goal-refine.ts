import { z } from "zod";
import type { Area } from "@/shared/config/constants";

export const goalRefineSchema = z.object({
  isSpecific: z
    .boolean()
    .describe(
      "True if the goal is already specific, measurable, and time-bound enough to generate a useful breakdown",
    ),
  feedback: z
    .string()
    .nullable()
    .describe(
      "Brief explanation of what makes the goal vague and what was improved. Null if isSpecific is true.",
    ),
  questions: z
    .array(z.string())
    .max(3)
    .nullable()
    .describe(
      "1-3 clarifying questions the AI used to refine the goal. Shown to user as context. Null if isSpecific is true.",
    ),
  refinedTitle: z
    .string()
    .nullable()
    .describe(
      "Improved, specific version of the goal title. Null if isSpecific is true.",
    ),
  refinedDescription: z
    .string()
    .nullable()
    .describe(
      "Improved description clarifying scope, success criteria, or key constraints. Null if isSpecific is true.",
    ),
});

export type GoalRefineResponse = z.infer<typeof goalRefineSchema>;

type BuildPromptInput = {
  title: string;
  description: string | null;
  area: Area;
  quarter: string;
  userContext?: string | null;
};

const AREA_CONTEXT: Record<Area, string> = {
  work: "professional outcomes — projects, skills, career milestones, revenue targets",
  personal: "life outside work — health, relationships, hobbies, finances",
  identity:
    "who you are becoming — habits, values, character traits, mindset shifts",
};

export function buildPrompt({
  title,
  description,
  area,
  quarter,
  userContext,
}: BuildPromptInput): string {
  const userBlock = userContext ? `${userContext}\n\n` : "";

  return `You are a goal-setting coach for Cadence, a personal productivity app.

${userBlock}

The user is creating a quarterly goal for the "${area}" area (${AREA_CONTEXT[area]}) for ${quarter}.

Evaluate whether the goal is specific enough to generate a useful milestone breakdown. A good goal is:
- Specific: clear outcome, not vague aspiration
- Measurable: has a success condition you can verify
- Scoped: fits within a single quarter

If the goal is already specific enough, return isSpecific: true with null for all other fields.

If the goal is too vague, return isSpecific: false and provide:
- feedback: one sentence explaining what's missing
- questions: 1-3 questions you'd ask to clarify (shown to user as context for the refinement)
- refinedTitle: a concrete, improved version of the title
- refinedDescription: a description that adds the missing specificity (success criteria, scope, constraints)

Be direct. Don't over-engineer specific goals. Don't add fluff.

Goal title: "${title}"
Description: ${description ? `"${description}"` : "none"}`;
}
