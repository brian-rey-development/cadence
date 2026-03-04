"use client";

import { Mail } from "lucide-react";
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
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: "var(--color-bg-elevated)",
              opacity: 0.12,
            }}
            aria-hidden="true"
          />
          <Mail
            size={40}
            strokeWidth={1.5}
            className="text-text-primary"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-body text-text-primary">
            Check your email
          </p>
          <p className="text-sm font-body text-text-secondary max-w-60">
            We sent a magic link to{" "}
            <span className="text-text-primary">{email}</span>
          </p>
        </div>
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
