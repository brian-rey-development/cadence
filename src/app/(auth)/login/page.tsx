import LoginForm from "@/modules/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[var(--color-bg-base)] px-5">
      <div className="flex w-full max-w-sm flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-['Fraunces'] text-[30px] font-light tracking-[-0.02em] lowercase text-[var(--color-text-primary)]">
            cadence
          </h1>
          <p className="text-[13px] font-['DM_Sans'] text-[var(--color-text-tertiary)] text-center">
            fewer things, done better
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <p className="text-center text-[13px] font-['DM_Sans'] text-[var(--color-text-secondary)]">
            Enter your email to continue
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
