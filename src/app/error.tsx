"use client";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center bg-[var(--color-bg-base)]">
      <p className="text-[17px] font-['Fraunces'] text-[var(--color-text-primary)]">
        Something went wrong
      </p>
      <p className="text-[13px] font-['DM_Sans'] text-[var(--color-text-secondary)] max-w-[260px]">
        An unexpected error occurred. Your data is safe.
      </p>
      <button
        type="button"
        onClick={reset}
        className="h-11 px-6 rounded-full bg-[var(--color-primary-bg)] text-[var(--color-primary-text)] text-[14px] font-medium font-['DM_Sans'] transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        Try again
      </button>
    </div>
  );
}
