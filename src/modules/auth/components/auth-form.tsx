"use client";

import { useState } from "react";
import SignInForm from "./sign-in-form";
import SignUpForm from "./sign-up-form";

type AuthTab = "signin" | "signup";

export default function AuthForm() {
  const [tab, setTab] = useState<AuthTab>("signin");

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex rounded-full border border-[var(--color-border-default)] p-1">
        <button
          type="button"
          onClick={() => setTab("signin")}
          className={`flex-1 h-9 rounded-full text-sm font-body transition-colors duration-150 ${
            tab === "signin"
              ? "bg-[var(--color-text-primary)] text-[var(--color-bg-base)]"
              : "text-text-secondary"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setTab("signup")}
          className={`flex-1 h-9 rounded-full text-sm font-body transition-colors duration-150 ${
            tab === "signup"
              ? "bg-[var(--color-text-primary)] text-[var(--color-bg-base)]"
              : "text-text-secondary"
          }`}
        >
          Create account
        </button>
      </div>

      {tab === "signin" ? <SignInForm /> : <SignUpForm />}
    </div>
  );
}
