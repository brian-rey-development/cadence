import LoginForm from "@/modules/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[var(--color-bg-base)] px-5">
      <div className="flex w-full max-w-sm flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-display text-3xl font-light tracking-tight lowercase text-text-primary">
            cadence
          </h1>
          <p className="text-sm font-body text-text-tertiary text-center">
            fewer things, done better
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <p className="text-center text-sm font-body text-text-secondary">
            Enter your email to continue
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
