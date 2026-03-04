"use client";

import { useState } from "react";
import BottomSheet from "@/shared/components/ui/bottom-sheet";
import StepIndicator from "@/shared/components/ui/step-indicator";
import { saveWeeklyReview } from "../mutations/save-weekly-review";
import type { WeeklyStats } from "../queries/get-weekly-stats";
import ReviewStepBlockers from "./review-step-blockers";
import ReviewStepStats from "./review-step-stats";
import ReviewStepSuggestions from "./review-step-suggestions";
import ReviewStepWins from "./review-step-wins";

const TOTAL_STEPS = 4;

type WeeklyReviewSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  stats: WeeklyStats;
  goals: Array<{ title: string; area: string }>;
  weekStart: string;
};

export default function WeeklyReviewSheet({
  isOpen,
  onClose,
  stats,
  goals,
  weekStart,
}: WeeklyReviewSheetProps) {
  const [step, setStep] = useState(1);
  const [wins, setWins] = useState("");
  const [blockers, setBlockers] = useState("");

  function handleWins(value: string) {
    setWins(value);
    setStep(3);
  }

  function handleBlockers(value: string) {
    setBlockers(value);
    setStep(4);
  }

  async function handleSave(intentions: string, aiSuggestions: string) {
    await saveWeeklyReview({
      weekStart,
      wins,
      blockers,
      intentions,
      aiSuggestions,
    });
    onClose();
  }

  function handleClose() {
    setStep(1);
    setWins("");
    setBlockers("");
    onClose();
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Weekly Review">
      <div className="flex flex-col gap-5">
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 1 && (
          <ReviewStepStats stats={stats} onNext={() => setStep(2)} />
        )}
        {step === 2 && <ReviewStepWins onNext={handleWins} />}
        {step === 3 && <ReviewStepBlockers onNext={handleBlockers} />}
        {step === 4 && (
          <ReviewStepSuggestions
            wins={wins}
            blockers={blockers}
            goals={goals}
            stats={stats}
            onSave={handleSave}
          />
        )}
      </div>
    </BottomSheet>
  );
}
