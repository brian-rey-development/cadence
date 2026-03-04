import type { AiProvider } from "@/modules/ai/models";
import { resolveModel } from "@/modules/ai/models";

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

const AI_PROVIDER = (process.env.AI_PROVIDER ?? "anthropic") as AiProvider;

const AI_KEY_MAP: Record<AiProvider, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  google: "GOOGLE_AI_API_KEY",
  xai: "XAI_API_KEY",
};

export const env = {
  supabaseUrl: required("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  aiProvider: AI_PROVIDER,
  aiModel: resolveModel(AI_PROVIDER, process.env.AI_MODEL),
  aiApiKey: required(AI_KEY_MAP[AI_PROVIDER]),
  cronSecret: required("CRON_SECRET"),
  googleAiApiKey: process.env.GOOGLE_AI_API_KEY,
  xaiApiKey: process.env.XAI_API_KEY,
  vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
} as const;
