import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center bg-[var(--color-bg-base)]">
      <p className="text-[17px] font-['Fraunces'] text-[var(--color-text-primary)]">
        Page not found
      </p>
      <p className="text-[13px] font-['DM_Sans'] text-[var(--color-text-secondary)] max-w-[260px]">
        This page doesn't exist or has been moved.
      </p>
      <Link
        href="/today"
        className="h-11 px-6 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary-text)] text-[14px] font-medium font-['DM_Sans'] inline-flex items-center transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        Back to Today
      </Link>
    </div>
  );
}
