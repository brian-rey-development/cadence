"use client";

import { useState } from "react";
import Button from "@/shared/components/ui/button";

type TaskIntentInputProps = {
  onSubmit: (intent: string) => void;
  isLoading: boolean;
  error: string | null;
};

export default function TaskIntentInput({
  onSubmit,
  isLoading,
  error,
}: TaskIntentInputProps) {
  const [intent, setIntent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = intent.trim();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
      <p
        className="text-sm font-body"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Describe what you want to do in plain language.
      </p>

      <textarea
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        placeholder="e.g. Prepare the Q2 proposal slides for Monday"
        rows={3}
        disabled={isLoading}
        className="w-full resize-none rounded-md px-4 py-3 text-sm font-body outline-none transition-colors duration-150 disabled:opacity-40"
        style={{
          backgroundColor: "var(--color-bg-base)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border-subtle)",
          minHeight: 80,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border-default)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border-subtle)";
        }}
      />

      {error && (
        <p className="text-sm font-body text-destructive-text">{error}</p>
      )}

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={!intent.trim() || isLoading}
        className="w-full"
      >
        Get suggestions
      </Button>
    </form>
  );
}
