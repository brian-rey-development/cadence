import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createXai } from "@ai-sdk/xai";
import type { LanguageModel } from "ai";
import { env } from "@/shared/config/env";

export function getModel(): LanguageModel {
  if (env.aiProvider === "google") {
    return createGoogleGenerativeAI({ apiKey: env.aiApiKey })(env.aiModel);
  }
  if (env.aiProvider === "xai") {
    return createXai({ apiKey: env.aiApiKey })(env.aiModel);
  }
  return createAnthropic({ apiKey: env.aiApiKey })(env.aiModel);
}
