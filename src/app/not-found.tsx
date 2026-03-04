import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center bg-[var(--color-bg-base)]">
      <p className="text-lg font-display text-text-primary">Page not found</p>
      <p className="text-sm font-body text-text-secondary max-w-[260px]">
        This page doesn't exist or has been moved.
      </p>
      <Link
        href="/today"
        className="h-11 px-6 rounded-full bg-[var(--color-primary-bg)] text-primary-text text-sm font-medium font-body inline-flex items-center transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        Back to Today
      </Link>
    </div>
  );
}
