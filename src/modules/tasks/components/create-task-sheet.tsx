"use client";

import { useState } from "react";
import type { GoalModel } from "@/db/schema/goals";
import type { CreateTaskResponse } from "@/modules/ai/prompts/create-task";
import BottomSheet from "@/shared/components/ui/bottom-sheet";
import type { Area } from "@/shared/config/constants";
import { today } from "@/shared/utils/date";
import { useCreateTask } from "../hooks/use-create-task";
import TaskIntentInput from "./task-intent-input";
import TaskSuggestionReview from "./task-suggestion-review";

type Step = "intent" | "review";

type CreateTaskSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateTaskSheet({
  isOpen,
  onClose,
}: CreateTaskSheetProps) {
  const [step, setStep] = useState<Step>("intent");
  const [suggestion, setSuggestion] = useState<CreateTaskResponse | null>(null);
  const [goals, setGoals] = useState<GoalModel[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const date = today();
  const { mutate: createTask, isPending } = useCreateTask(date);

  async function handleIntentSubmit(intent: string) {
    setIsLoadingAI(true);
    setAiError(null);

    try {
      const res = await fetch("/api/ai/create-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent }),
      });

      if (!res.ok) throw new Error("Failed to get suggestion");

      const { suggestion: s, goals: g } = await res.json();
      setSuggestion(s);
      setGoals(g ?? []);
      setStep("review");
    } catch {
      setAiError("Something went wrong. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  }

  function handleConfirm(data: {
    title: string;
    area: Area;
    type: "daily" | "weekly" | "quarterly";
    date: string | null;
    weekStart: string | null;
    goalId: string | null;
  }) {
    createTask(
      {
        userId: "optimistic",
        title: data.title,
        area: data.area,
        type: data.type,
        date: data.date,
        weekStart: data.weekStart,
        goalId: data.goalId ?? null,
        milestoneId: null,
        status: "pending",
        postponeCount: 0,
        completedAt: null,
      },
      {
        onSuccess: () => handleClose(),
      },
    );
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep("intent");
      setSuggestion(null);
      setAiError(null);
    }, 400);
  }

  const title = step === "intent" ? "New task" : "Review suggestion";

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title={title}>
      {step === "intent" && (
        <TaskIntentInput
          onSubmit={handleIntentSubmit}
          isLoading={isLoadingAI}
          error={aiError}
        />
      )}
      {step === "review" && suggestion && (
        <TaskSuggestionReview
          suggestion={suggestion}
          goals={goals}
          date={date}
          onConfirm={handleConfirm}
          isSubmitting={isPending}
        />
      )}
    </BottomSheet>
  );
}
