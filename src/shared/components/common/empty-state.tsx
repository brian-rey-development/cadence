type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-5 text-center">
      <p className="text-lg font-body font-medium text-text-primary leading-[26px]">
        {title}
      </p>
      {description && (
        <p className="text-sm font-body text-text-secondary leading-5 max-w-60">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
