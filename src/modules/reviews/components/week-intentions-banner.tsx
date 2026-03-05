type WeekIntentionsBannerProps = {
  intentions: string | null;
};

export default function WeekIntentionsBanner({
  intentions,
}: WeekIntentionsBannerProps) {
  if (!intentions) return null;

  return (
    <div className="flex py-3 pl-4 border-l-2 border-border-strong">
      <p className="text-base leading-relaxed italic text-text-secondary">
        {intentions}
      </p>
    </div>
  );
}
