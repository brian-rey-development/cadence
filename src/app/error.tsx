"use client";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function AppError({ reset }: ErrorProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center bg-[var(--color-bg-base)]">
      <p className="text-xl font-display text-text-primary">
        Something went wrong
      </p>
      <p className="text-base font-body text-text-secondary max-w-[260px]">
        An unexpected error occurred. Your data is safe.
      </p>
      <button
        type="button"
        onClick={reset}
        className="h-11 px-6 rounded-full bg-[var(--color-primary-bg)] text-primary-text text-base font-medium font-body transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        Try again
      </button>
    </div>
  );
}
