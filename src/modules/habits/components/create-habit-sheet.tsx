"use client";

import { useState } from "react";
import type { HabitFeedback } from "@/modules/ai/prompts/refine-habit";
import Sheet from "@/shared/components/ui/sheet";
import StepIndicator from "@/shared/components/ui/step-indicator";
import type { Area } from "@/shared/config/constants";
import { useCreateHabit } from "../hooks/use-create-habit";
import HabitAiFeedback from "./habit-ai-feedback";
import HabitForm from "./habit-form";

type CreateHabitSheetProps = {
  open: boolean;
  onClose: () => void;
};

type Step = "form" | "feedback";

async function fetchHabitFeedback(
  name: string,
  area: Area,
  weeklyFrequency: number,
): Promise<HabitFeedback> {
  const res = await fetch("/api/ai/refine-habit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, area, weeklyFrequency }),
  });
  if (!res.ok) throw new Error("AI feedback failed");
  return res.json();
}

export default function CreateHabitSheet({ open, onClose }: CreateHabitSheetProps) {
  const [name, setName] = useState("");
  const [area, setArea] = useState<Area>("work");
  const [frequency, setFrequency] = useState(7);
  const [step, setStep] = useState<Step>("form");
  const [feedback, setFeedback] = useState<HabitFeedback | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const { mutate, isPending } = useCreateHabit();

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setIsFetching(true);
    try {
      const result = await fetchHabitFeedback(name.trim(), area, frequency);
      setFeedback(result);
      setStep("feedback");
    } catch (err) {
      console.warn("[create-habit] AI feedback unavailable, saving directly:", err);
      handleSave();
    } finally {
      setIsFetching(false);
    }
  }

  function handleSave() {
    mutate(
      { name: name.trim(), area, weeklyFrequency: frequency },
      {
        onSuccess: () => {
          setName("");
          setArea("work");
          setFrequency(7);
          setStep("form");
          setFeedback(null);
          onClose();
        },
      },
    );
  }

  const title = step === "form" ? "New habit" : "Coach says";

  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <div className="flex flex-col gap-5">
        <StepIndicator currentStep={step === "form" ? 1 : 2} totalSteps={2} />

        {step === "form" && (
          <HabitForm
            name={name}
            area={area}
            frequency={frequency}
            isLoading={isFetching || isPending}
            onNameChange={setName}
            onAreaChange={setArea}
            onFrequencyChange={setFrequency}
            onSubmit={handleContinue}
          />
        )}

        {step === "feedback" && feedback && (
          <HabitAiFeedback
            feedback={feedback}
            area={area}
            onSave={handleSave}
            onBack={() => setStep("form")}
            isSaving={isPending}
          />
        )}
      </div>
    </Sheet>
  );
}
