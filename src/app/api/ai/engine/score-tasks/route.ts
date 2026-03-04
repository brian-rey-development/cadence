import { generateObject } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { getModel } from "@/modules/ai/client";
import { upsertTaskScores } from "@/modules/ai-engine/mutations/upsert-task-scores";
import {
  buildPrompt,
  taskScoreSchema,
} from "@/modules/ai-engine/prompts/score-tasks";
import { getTaskScores } from "@/modules/ai-engine/queries/get-task-scores";
import { getTasksForScoring } from "@/modules/ai-engine/queries/get-tasks-for-scoring";
import { buildRagContext } from "@/modules/ai-engine/utils/context-builder";
import { isStale } from "@/modules/ai-engine/utils/stale";
import { env } from "@/shared/config/env";
import { today } from "@/shared/utils/date";

type ScoreTasksBody = { userId: string };

function authorized(req: NextRequest): boolean {
  return req.headers.get("authorization") === `Bearer ${env.cronSecret}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = (await req.json()) as ScoreTasksBody;
  const tasks = await getTasksForScoring(userId);

  if (tasks.length === 0) {
    return NextResponse.json({ ok: true, scored: 0 });
  }

  const existingScores = await getTaskScores(
    userId,
    tasks.map((t) => t.id),
  );
  const stale = existingScores.some((s) => isStale(s.computedAt, 24));

  if (!stale && existingScores.length === tasks.length) {
    return NextResponse.json({ ok: true, cached: true });
  }

  const goals = [
    ...new Map(
      tasks
        .filter(
          (t): t is typeof t & { goalId: string; goalTitle: string } =>
            t.goalId !== null && t.goalTitle !== null,
        )
        .map((t) => [
          t.goalId,
          { id: t.goalId, title: t.goalTitle, area: t.area },
        ]),
    ).values(),
  ];

  const ragContext = await buildRagContext(
    userId,
    tasks.map((t) => t.title).join(", "),
  );

  const { object } = await generateObject({
    model: getModel(),
    schema: taskScoreSchema,
    prompt: buildPrompt({ tasks, goals, ragContext, today: today() }),
  });

  await upsertTaskScores(userId, object.scores);

  return NextResponse.json({ ok: true, scored: object.scores.length });
}
