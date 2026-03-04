"use server";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { aiEmbeddings, type EntityType } from "@/db/schema/ai-engine";

export async function upsertEmbedding(
  userId: string,
  entityType: EntityType,
  entityId: string,
  content: string,
  embedding: number[],
): Promise<void> {
  await db
    .insert(aiEmbeddings)
    .values({
      userId,
      entityType,
      entityId,
      content,
      embedding,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [aiEmbeddings.entityId, aiEmbeddings.entityType],
      set: {
        content: sql`excluded.content`,
        embedding: sql`excluded.embedding`,
        updatedAt: sql`excluded.updated_at`,
      },
    });
}
