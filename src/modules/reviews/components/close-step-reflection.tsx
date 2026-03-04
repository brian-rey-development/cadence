"use client";

import { useState } from "react";
import type { TaskWithGoal } from "@/modules/tasks/tasks.types";
import { useDailyClose } from "../hooks/use-daily-close";

type CloseStepReflectionProps = {
  completedTasks: TaskWithGoal[];
  date: string;
  onClose: () => void;
};

export default function CloseStepReflection({
  completedTasks,
  date,
  onClose,
}: CloseStepReflectionProps) {
  const [reflection, setReflection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { saveDailyReview } = useDailyClose();

  async function handleSave() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/daily-close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completedTitles: completedTasks.map((t) => t.title),
          reflection,
          date,
        }),
      });
      const data = await res.json();
      await saveDailyReview({
        date,
        reflection,
        aiSummary: data.summary ?? "",
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <p
        className="font-['Fraunces'] text-base"
        style={{ color: "var(--color-text-primary)" }}
      >
        How did today feel?
      </p>

      <p
        className="font-['DM_Sans'] text-[13px] -mt-4"
        style={{ color: "var(--color-text-secondary)" }}
      >
        A few sentences is enough.
      </p>

      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="What went well? What got in the way?"
        rows={5}
        className="w-full resize-none rounded-xl px-4 py-3 font-['DM_Sans'] text-sm outline-none"
        style={{
          backgroundColor: "var(--color-bg-surface)",
          border: "1px solid var(--color-border-subtle)",
          color: "var(--color-text-primary)",
        }}
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={isLoading}
        className="min-h-[44px] w-full rounded-xl font-['DM_Sans'] text-sm font-medium transition-opacity disabled:opacity-50"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
        }}
      >
        {isLoading ? "Saving..." : "Save & Close"}
      </button>
    </div>
  );
}
