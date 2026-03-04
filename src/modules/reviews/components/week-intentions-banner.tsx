type WeekIntentionsBannerProps = {
  intentions: string | null;
};

export default function WeekIntentionsBanner({ intentions }: WeekIntentionsBannerProps) {
  if (!intentions) return null;

  return (
    <div className="flex py-3 pl-4 border-l-2 border-border-subtle">
      <p className="text-sm leading-relaxed italic text-text-secondary">{intentions}</p>
    </div>
  );
}
