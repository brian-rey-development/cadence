type LoadingSkeletonProps = {
  rows?: number;
  className?: string;
};

function SkeletonRow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-md bg-[var(--color-bg-surface)] animate-pulse ${className}`}
    />
  );
}

export default function LoadingSkeleton({
  rows = 3,
  className = "",
}: LoadingSkeletonProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: rows }, (_, i) => `skeleton-${i}`).map((id) => (
        <SkeletonRow key={id} className="h-14 w-full" />
      ))}
    </div>
  );
}
