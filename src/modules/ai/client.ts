import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createXai } from "@ai-sdk/xai";
import type { LanguageModel } from "ai";

const PROVIDER = process.env.AI_PROVIDER ?? "anthropic";
const MODEL = process.env.AI_MODEL ?? "claude-haiku-4-5-20251001";

export function getModel(): LanguageModel {
  if (PROVIDER === "google") {
    return createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    })(MODEL);
  }
  if (PROVIDER === "xai") {
    return createXai({ apiKey: process.env.XAI_API_KEY })(MODEL);
  }
  return createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(MODEL);
}
