"use client";

import { useState } from "react";
import { signIn } from "@/modules/auth/mutations/sign-in";
import Button from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import { createClient } from "@/shared/lib/supabase/client";

type FormState = "idle" | "loading" | "error";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(undefined);

    const result = await signIn(email, password);

    if (!result.success) {
      setState("error");
      setError(result.error);
    }
  }

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={state === "loading"}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          error={state === "error" ? error : undefined}
          disabled={state === "loading"}
        />
        <Button
          type="submit"
          variant="primary"
          isLoading={state === "loading"}
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
        <span className="text-sm font-body text-text-tertiary">or</span>
        <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={handleGoogleSignIn}
        className="w-full border border-[var(--color-border-subtle)]"
      >
        Continue with Google
      </Button>
    </div>
  );
}
