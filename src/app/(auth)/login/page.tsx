import LoginForm from "@/modules/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#0E0E0F] px-5">
      <div className="flex w-full max-w-sm flex-col items-center gap-10">
        <h1 className="font-['Fraunces'] text-[30px] font-light tracking-[-0.02em] lowercase text-[#F0EDE8]">
          cadence
        </h1>
        <div className="flex w-full flex-col gap-2">
          <p className="text-center text-[13px] font-['DM_Sans'] text-[#8A8A95]">
            Enter your email to continue
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
