import AuthForm from "@/modules/auth/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[var(--color-bg-base)] px-5">
      <div className="flex w-full max-w-sm flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-display text-4xl font-light tracking-tight lowercase text-text-primary">
            cadence
          </h1>
          <p className="text-base font-body text-text-tertiary text-center">
            fewer things, done better
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
