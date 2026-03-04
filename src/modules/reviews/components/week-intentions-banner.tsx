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
      className="flex gap-3 py-3 pl-4"
      style={{ borderLeft: "2px solid var(--color-border-subtle)" }}
    >
      <p
        className="text-sm leading-relaxed italic"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {intentions}
      </p>
    </div>
  );
}
