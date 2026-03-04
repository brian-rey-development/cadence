import { type NextRequest, NextResponse } from "next/server";
import type { EntityType } from "@/db/schema/ai-engine";
import { upsertEmbedding } from "@/modules/ai-engine/mutations/upsert-embedding";
import { embedTexts } from "@/modules/ai-engine/utils/embed";
import { env } from "@/shared/config/env";

type EmbedBody = {
  userId: string;
  entityType: EntityType;
  entityId: string;
  content: string;
};

function authorized(req: NextRequest): boolean {
  return req.headers.get("authorization") === `Bearer ${env.cronSecret}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as EmbedBody;
  const { userId, entityType, entityId, content } = body;

  const [embedding] = await embedTexts([content]);
  if (!embedding) {
    return NextResponse.json({ error: "Embedding failed" }, { status: 500 });
  }

  await upsertEmbedding(userId, entityType, entityId, content, embedding);

  return NextResponse.json({ ok: true });
}
