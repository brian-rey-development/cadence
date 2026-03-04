import { z } from "zod";

export const dailyCloseSchema = z.object({
  summary: z.string().describe("2-sentence max summary of the user's day"),
  mood: z
    .enum(["great", "good", "okay", "tough"])
    .describe(
      "Overall mood/tone of the day based on completion and reflection",
    ),
});

export type DailyCloseResponse = z.infer<typeof dailyCloseSchema>;

type BuildPromptInput = {
  completedTitles: string[];
  reflection: string;
  date: string;
  userContext?: string | null;
};

export function buildPrompt({
  completedTitles,
  reflection,
  date,
  userContext,
}: BuildPromptInput): string {
  const taskList =
    completedTitles.length > 0
      ? completedTitles.map((t) => `- ${t}`).join("\n")
      : "No tasks completed.";

  const userBlock = userContext ? `${userContext}\n\n` : "";

  return `You are a productivity assistant helping the user close out their day in Cadence.

${userBlock}

Date: ${date}

Completed tasks:
${taskList}

User's reflection: "${reflection}"

Summarize this day in exactly 2 sentences. Be warm, honest, and grounded. Infer the mood from how much was completed and the tone of the reflection. Return summary and mood.`;
}
