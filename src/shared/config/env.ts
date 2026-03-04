function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

const AI_PROVIDER = process.env.AI_PROVIDER ?? "anthropic";

const AI_KEY_MAP: Record<string, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  google: "GOOGLE_AI_API_KEY",
  xai: "XAI_API_KEY",
};

export const env = {
  supabaseUrl: required("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  aiProvider: AI_PROVIDER,
  aiModel: process.env.AI_MODEL ?? "claude-sonnet-4-6",
  aiApiKey: required(AI_KEY_MAP[AI_PROVIDER] ?? "ANTHROPIC_API_KEY"),
} as const;
