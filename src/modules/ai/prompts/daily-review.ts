import { z } from "zod";

export const dailyReviewSchema = z.object({
  feedback: z
    .string()
    .describe(
      "2-3 paragraph warm, personal response to the user's day — grounded, honest, not generic",
    ),
  insights: z
    .array(z.string())
    .max(4)
    .describe("2-4 actionable observations drawn from the day's patterns"),
  nextDayFocus: z
    .string()
    .describe(
      "1 sentence suggesting the single most important focus for tomorrow",
    ),
});

export type DailyReviewResponse = z.infer<typeof dailyReviewSchema>;

type CompletedTask = {
  title: string;
  area: string;
};

type WeekStats = {
  completedThisWeek: number;
  habitsConsistency: number;
};

type BuildPromptInput = {
  completedTasks: CompletedTask[];
  reflection: string;
  gratitude: string;
  challenges: string;
  learnings: string;
  tomorrowFocus: string;
  mood: "great" | "good" | "okay" | "tough";
  date: string;
  weekStats?: WeekStats;
  userContext?: string | null;
};

const MOOD_LABELS: Record<string, string> = {
  great: "great — energized and productive",
  good: "good — solid and on track",
  okay: "okay — got through it",
  tough: "tough — struggled today",
};

export function buildPrompt({
  completedTasks,
  reflection,
  gratitude,
  challenges,
  learnings,
  tomorrowFocus,
  mood,
  date,
  weekStats,
  userContext,
}: BuildPromptInput): string {
  const userBlock = userContext ? `${userContext}\n\n` : "";

  const taskList =
    completedTasks.length > 0
      ? completedTasks.map((t) => `- ${t.title} (${t.area})`).join("\n")
      : "No tasks completed.";

  const weekBlock = weekStats
    ? `\nWeek so far: ${weekStats.completedThisWeek} tasks completed, ${weekStats.habitsConsistency}% habit consistency`
    : "";

  return `You are a thoughtful reflection coach for Cadence, a personal productivity app.

${userBlock}The user has just completed their daily close for ${date}. Review their day and provide a meaningful, personalized response.

Mood: ${MOOD_LABELS[mood] ?? mood}

Completed tasks:
${taskList}
${weekBlock}

User's reflection:
${reflection || "Not provided."}

Gratitude:
${gratitude || "Not provided."}

Challenges:
${challenges || "Not provided."}

What they learned:
${learnings || "Not provided."}

What they want to focus on tomorrow:
${tomorrowFocus || "Not provided."}

Rules:
- feedback: 2-3 paragraphs. Be warm, honest, and personal. Reference specifics from their responses. Match the energy to their mood — don't be cheerful when they're struggling.
- insights: 2-4 concrete, actionable observations. Draw patterns from what was completed, what was hard, and what they learned. Not generic advice.
- nextDayFocus: 1 crisp sentence. Build on their stated tomorrow focus or suggest the most logical next step.
- Never use placeholder phrases like "It sounds like..." or "It seems...". Be direct and specific.`;
}
