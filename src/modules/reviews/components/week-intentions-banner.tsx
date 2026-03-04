import { Quote } from "lucide-react";

type WeekIntentionsBannerProps = {
  intentions: string | null;
};

export default function WeekIntentionsBanner({
  intentions,
}: WeekIntentionsBannerProps) {
  if (!intentions) return null;

  return (
    <div
      className="flex gap-3 rounded-xl px-4 py-4"
      style={{
        backgroundColor: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-subtle)",
      }}
    >
      <Quote
        size={16}
        strokeWidth={1.5}
        className="mt-0.5 shrink-0"
        style={{ color: "var(--color-text-tertiary)" }}
      />
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {intentions}
      </p>
    </div>
  );
}
