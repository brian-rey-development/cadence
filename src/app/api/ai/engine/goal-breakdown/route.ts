import { generateObject } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { getModel } from "@/modules/ai/client";
import { upsertGoalBreakdown } from "@/modules/ai-engine/mutations/upsert-goal-breakdown";
import {
  buildPrompt,
  goalBreakdownSchema,
} from "@/modules/ai-engine/prompts/goal-breakdown";
import { getGoalBreakdown } from "@/modules/ai-engine/queries/get-goal-breakdown";
import { getGoalForBreakdown } from "@/modules/ai-engine/queries/get-goal-for-breakdown";
import { buildRagContext } from "@/modules/ai-engine/utils/context-builder";
import { isStale } from "@/modules/ai-engine/utils/stale";
import { env } from "@/shared/config/env";
import { today } from "@/shared/utils/date";

type GoalBreakdownBody = { userId: string; goalId: string };

function authorized(req: NextRequest): boolean {
  return req.headers.get("authorization") === `Bearer ${env.cronSecret}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, goalId } = (await req.json()) as GoalBreakdownBody;

  const existing = await getGoalBreakdown(userId, goalId);
  if (existing && !isStale(existing.computedAt, 72)) {
    return NextResponse.json({ ok: true, cached: true });
  }

  const goal = await getGoalForBreakdown(userId, goalId);
  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  const ragContext = await buildRagContext(userId, goal.title);

  const { object } = await generateObject({
    model: getModel(),
    schema: goalBreakdownSchema,
    prompt: buildPrompt({ goal, ragContext, today: today() }),
  });

  await upsertGoalBreakdown(userId, goalId, object.milestones);

  return NextResponse.json({ ok: true });
}
