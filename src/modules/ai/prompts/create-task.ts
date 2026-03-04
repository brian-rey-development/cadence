import { z } from "zod";
import type { GoalModel } from "@/db/schema/goals";
import { AREAS, DAILY_TASK_LIMIT } from "@/shared/config/constants";

export const createTaskSchema = z.object({
  title: z
    .string()
    .describe("Clear, action-oriented task title in sentence case"),
  area: z.enum(AREAS).describe("Life area this task belongs to"),
  date: z
    .string()
    .describe("ISO date YYYY-MM-DD for when to schedule the task"),
  goalId: z
    .string()
    .nullable()
    .describe("ID of the related goal, or null if none applies"),
  warning: z
    .string()
    .nullable()
    .describe(
      "Optional warning message to show the user, e.g. about the daily limit",
    ),
});

export type CreateTaskResponse = z.infer<typeof createTaskSchema>;

type BuildPromptInput = {
  intent: string;
  existingTaskCount: number;
  goals: GoalModel[];
  date: string;
};

export function buildPrompt({
  intent,
  existingTaskCount,
  goals,
  date,
}: BuildPromptInput): string {
  const atLimit = existingTaskCount >= DAILY_TASK_LIMIT;
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().slice(0, 10);

  const goalsList =
    goals.length > 0
      ? goals
          .map((g) => `- id: ${g.id} | title: "${g.title}" | area: ${g.area}`)
          .join("\n")
      : "No active goals.";

  const limitNote = atLimit
    ? `\n\nIMPORTANT: The user already has ${existingTaskCount} tasks today, which is the daily limit of ${DAILY_TASK_LIMIT}. Set warning to: "You've hit your daily limit. This task will be scheduled for tomorrow." and set date to ${tomorrowISO}.`
    : "";

  return `You are a productivity assistant for Cadence, a personal task management app.

The user wants to create a task. Given their natural language intent, return a structured task suggestion.

Today's date: ${date}
Tomorrow's date: ${tomorrowISO}
Tasks already scheduled for today: ${existingTaskCount}/${DAILY_TASK_LIMIT}

Active goals:
${goalsList}
${limitNote}

Rules:
- Title must be concise, action-oriented (start with a verb), sentence case
- Choose area (work/personal/identity) based on the intent and context
- Default date to today (${date}) unless the user specifies otherwise or the daily limit is reached
- Link to a goal only if one is clearly relevant — never force a connection
- Keep warning null unless there's a genuine issue (limit reached, ambiguous intent)

User intent: "${intent}"`;
}
