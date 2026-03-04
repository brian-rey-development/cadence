import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embedMany } from "ai";
import { env } from "@/shared/config/env";

const EMBEDDING_MODEL = "text-embedding-004";

function getEmbeddingModel() {
  const google = createGoogleGenerativeAI({
    apiKey: env.googleAiApiKey ?? "",
  });
  return google.textEmbeddingModel(EMBEDDING_MODEL);
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const { embeddings } = await embedMany({
    model: getEmbeddingModel(),
    values: texts,
  });
  return embeddings;
}
