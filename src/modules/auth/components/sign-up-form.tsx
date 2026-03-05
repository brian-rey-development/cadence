"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { signUp } from "@/modules/auth/mutations/sign-up";
import Button from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import { MIN_PASSWORD_LENGTH } from "@/shared/config/constants";

type FormState = "idle" | "loading" | "sent" | "error";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      setState("error");
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    setState("loading");
    setError(undefined);

    const result = await signUp(email, password, name);

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
            className="absolute inset-0 rounded-full bg-[var(--color-bg-elevated)] opacity-[0.12]"
            aria-hidden="true"
          />
          <Mail size={40} strokeWidth={1.5} className="text-text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-body text-text-primary">
            Check your email
          </p>
          <p className="text-base font-body text-text-secondary max-w-60">
            We sent a confirmation link to{" "}
            <span className="text-text-primary">{email}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <Input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoComplete="name"
        disabled={state === "loading"}
      />
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
        autoComplete="new-password"
        error={state === "error" ? error : undefined}
        disabled={state === "loading"}
      />
      <Button
        type="submit"
        variant="primary"
        isLoading={state === "loading"}
        className="w-full"
      >
        Create account
      </Button>
    </form>
  );
}
