import { z } from "zod";
import type { GoalModel } from "@/db/schema/goals";
import { AREAS, DAILY_TASK_LIMIT } from "@/shared/config/constants";

export const createTaskSchema = z.object({
  title: z
    .string()
    .describe("Clear, action-oriented task title in sentence case"),
  area: z.enum(AREAS).describe("Life area this task belongs to"),
  type: z
    .enum(["daily", "weekly", "quarterly"])
    .describe(
      "Task type: daily = single concrete action for one day; weekly = multi-day effort spanning a week; quarterly = a goal milestone",
    ),
  date: z
    .string()
    .nullable()
    .describe("ISO date YYYY-MM-DD for daily tasks; null for quarterly tasks"),
  weekStart: z
    .string()
    .nullable()
    .describe(
      "ISO date YYYY-MM-DD of the Monday starting the week; required when type = weekly, null otherwise",
    ),
  goalId: z
    .string()
    .nullable()
    .describe("ID of the related goal, or null if none applies"),
  schedulingReason: z
    .string()
    .nullable()
    .describe(
      "1-sentence explanation of why this date/type was chosen; shown as a tooltip to the user",
    ),
  warning: z
    .string()
    .nullable()
    .describe(
      "Optional warning message to show the user, e.g. about the daily limit",
    ),
});

export type CreateTaskResponse = z.infer<typeof createTaskSchema>;

type WeekLoad = {
  date: string;
  taskCount: number;
};

type MilestoneTarget = {
  goalId: string;
  targetDate: string;
  title: string;
};

type BuildPromptInput = {
  intent: string;
  existingTaskCount: number;
  goals: GoalModel[];
  date: string;
  userContext?: string | null;
  weekLoad?: WeekLoad[];
  milestones?: MilestoneTarget[];
};

export function buildPrompt({
  intent,
  existingTaskCount,
  goals,
  date,
  userContext,
  weekLoad,
  milestones,
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

  const weekLoadBlock =
    weekLoad && weekLoad.length > 0
      ? `\nWeek capacity (next 7 days):\n${weekLoad
          .map((d) => `- ${d.date}: ${d.taskCount}/${DAILY_TASK_LIMIT} tasks`)
          .join("\n")}`
      : "";

  const milestonesBlock =
    milestones && milestones.length > 0
      ? `\nGoal milestone targets:\n${milestones
          .map((m) => `- "${m.title}" due ${m.targetDate}`)
          .join("\n")}`
      : "";

  const userBlock = userContext ? `${userContext}\n\n` : "";

  return `You are a productivity assistant for Cadence, a personal task management app.

${userBlock}The user wants to create a task. Given their natural language intent, return a structured task suggestion.

Today's date: ${date}
Tomorrow's date: ${tomorrowISO}
Tasks already scheduled for today: ${existingTaskCount}/${DAILY_TASK_LIMIT}

Active goals:
${goalsList}
${weekLoadBlock}
${milestonesBlock}
${limitNote}

Rules:
- Title must be concise, action-oriented (start with a verb), sentence case
- Choose area (work/personal/identity) based on the intent and context
- Choose type based on scope: daily = a single concrete action done in one sitting; weekly = a multi-day effort that spans a week; quarterly = a goal milestone or ongoing project deliverable
- For daily tasks: prefer the day with fewest tasks among the next 7 days; if today is under the limit use today, if at limit use the next lightest day
- For daily tasks: set date accordingly; weekStart must be null
- For weekly tasks: set weekStart to the Monday of the relevant week; date must be null
- For quarterly tasks: set both date and weekStart to null
- If task relates to a milestone, schedule before or on the milestone target date
- Link to a goal only if one is clearly relevant — never force a connection
- Always populate schedulingReason with a 1-sentence explanation of the scheduling decision
- Keep warning null unless there's a genuine issue (limit reached, ambiguous intent)

User intent: "${intent}"`;
}
