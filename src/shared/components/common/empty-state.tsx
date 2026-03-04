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
      <p className="text-[17px] font-['DM_Sans'] font-medium text-[#F0EDE8] leading-[26px]">
        {title}
      </p>
      {description && (
        <p className="text-[13px] font-['DM_Sans'] text-[#8A8A95] leading-5 max-w-[240px]">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
