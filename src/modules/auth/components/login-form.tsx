"use client";

import { useState } from "react";
import { sendMagicLink } from "@/modules/auth/mutations/send-magic-link";
import Button from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";

type FormState = "idle" | "loading" | "sent" | "error";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(undefined);

    const result = await sendMagicLink(email);

    if (result.success) {
      setState("sent");
    } else {
      setState("error");
      setError(result.error);
    }
  }

  if (state === "sent") {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[15px] font-['DM_Sans'] text-[var(--color-text-primary)]">
          Check your email
        </p>
        <p className="text-[13px] font-['DM_Sans'] text-[var(--color-text-secondary)] max-w-[240px]">
          We sent a magic link to{" "}
          <span className="text-[var(--color-text-primary)]">{email}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        error={state === "error" ? error : undefined}
        disabled={state === "loading"}
      />
      <Button
        type="submit"
        variant="primary"
        isLoading={state === "loading"}
        className="w-full"
      >
        Continue with email
      </Button>
    </form>
  );
}
