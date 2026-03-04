import { sql } from "drizzle-orm";
import { db } from "@/db";
import type { EntityType } from "@/db/schema/ai-engine";

type EmbeddingMatch = {
  entityId: string;
  entityType: EntityType;
  content: string;
  similarity: number;
};

export async function searchEmbeddings(
  userId: string,
  queryEmbedding: number[],
  limit = 8,
  entityTypes?: EntityType[],
): Promise<EmbeddingMatch[]> {
  const vectorStr = `[${queryEmbedding.join(",")}]`;

  const typeFilter =
    entityTypes && entityTypes.length > 0
      ? sql`AND entity_type = ANY(ARRAY[${sql.join(
          entityTypes.map((t) => sql`${t}`),
          sql`, `,
        )}]::text[])`
      : sql``;

  const rows = await db.execute(
    sql`
      SELECT entity_id, entity_type, content,
             1 - (embedding <=> ${sql.raw(`'${vectorStr}'`)}::vector) AS similarity
      FROM ai_embeddings
      WHERE user_id = ${userId}
      ${typeFilter}
      ORDER BY embedding <=> ${sql.raw(`'${vectorStr}'`)}::vector
      LIMIT ${limit}
    `,
  );

  return (
    rows as unknown as Array<{
      entity_id: string;
      entity_type: EntityType;
      content: string;
      similarity: string | number;
    }>
  ).map((r) => ({
    entityId: r.entity_id,
    entityType: r.entity_type,
    content: r.content,
    similarity: Number(r.similarity),
  }));
}
