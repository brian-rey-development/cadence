import { generateObject } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { goals } from "@/db/schema/goals";
import { getModel } from "@/modules/ai/client";
import { upsertUserContext } from "@/modules/ai-engine/mutations/upsert-user-context";
import {
  buildPrompt,
  userContextSchema,
} from "@/modules/ai-engine/prompts/user-context";
import { getUserSnapshotData } from "@/modules/ai-engine/queries/get-user-snapshot-data";
import { env } from "@/shared/config/env";

type UserContextBody = { userId?: string; all?: boolean };

function authorized(req: NextRequest): boolean {
  return req.headers.get("authorization") === `Bearer ${env.cronSecret}`;
}

async function processUser(userId: string): Promise<void> {
  const snapshotData = await getUserSnapshotData(userId);
  const { object } = await generateObject({
    model: getModel(),
    schema: userContextSchema,
    prompt: buildPrompt(snapshotData),
  });
  await upsertUserContext(userId, object.snapshot);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as UserContextBody;

  if (body.all) {
    const rows = await db.selectDistinct({ userId: goals.userId }).from(goals);
    await Promise.allSettled(rows.map((r) => processUser(r.userId)));
    return NextResponse.json({ ok: true, processed: rows.length });
  }

  if (!body.userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  await processUser(body.userId);
  return NextResponse.json({ ok: true });
}
