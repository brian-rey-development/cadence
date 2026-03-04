import { z } from "zod";

export const QUOTE_THEMES = [
  "focus",
  "resilience",
  "momentum",
  "clarity",
  "growth",
  "balance",
] as const;

export type QuoteTheme = (typeof QUOTE_THEMES)[number];

export const dailyQuoteSchema = z.object({
  quote: z
    .string()
    .describe(
      "Original quote, max 2 sentences. Not a famous quote — written for this specific user.",
    ),
  theme: z
    .enum(QUOTE_THEMES)
    .describe("Single-word theme that best characterizes the quote"),
});

export type DailyQuoteResponse = z.infer<typeof dailyQuoteSchema>;

type Goal = {
  title: string;
  area: string;
};

type BuildPromptInput = {
  date: string;
  goals: Goal[];
  recentMoods: string[];
  userContext?: string | null;
};

export function buildPrompt({
  date,
  goals,
  recentMoods,
  userContext,
}: BuildPromptInput): string {
  const userBlock = userContext ? `${userContext}\n\n` : "";

  const goalsList =
    goals.length > 0
      ? goals.map((g) => `- "${g.title}" (${g.area})`).join("\n")
      : "No active goals.";

  const moodsBlock =
    recentMoods.length > 0
      ? `Recent moods: ${recentMoods.join(", ")}`
      : "No recent mood data.";

  return `You are a personal reflection guide for Cadence.

${userBlock}Write an original, personal quote for this user to start their day. The quote should be grounding and forward-looking — not generic motivation.

Date: ${date}
${moodsBlock}

Active goals:
${goalsList}

Rules:
- The quote must be original — do NOT use or paraphrase famous quotes
- Write for THIS user based on their goals and recent trajectory
- Max 2 sentences. Clear, honest, not flowery.
- Choose the theme (${QUOTE_THEMES.join(" | ")}) that best matches the quote's energy
- Do not start with "I" or the user's name`;
}
