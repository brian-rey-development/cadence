export type AiProvider = "anthropic" | "google" | "xai";

export const PROVIDER_DEFAULT_MODELS: Record<AiProvider, string> = {
  anthropic: "claude-sonnet-4-6",
  google: "gemini-2.0-flash",
  xai: "grok-4-1-fast-reasoning",
};

export function resolveModel(provider: AiProvider, override?: string): string {
  return override ?? PROVIDER_DEFAULT_MODELS[provider];
}
