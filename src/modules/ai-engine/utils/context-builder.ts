import { searchEmbeddings } from "../queries/search-embeddings";
import { embedTexts } from "./embed";

export async function buildRagContext(
  userId: string,
  queryText: string,
  limit = 6,
): Promise<string> {
  try {
    const [queryEmbedding] = await embedTexts([queryText]);
    if (!queryEmbedding) return "";

    const matches = await searchEmbeddings(userId, queryEmbedding, limit);
    if (matches.length === 0) return "";

    return matches.map((m) => `[${m.entityType}] ${m.content}`).join("\n\n");
  } catch (err) {
    console.warn(
      "[rag-context] embedding unavailable, skipping context:",
      err instanceof Error ? err.message : err,
    );
    return "";
  }
}
