"use client";

import { useState } from "react";
import type { DailyReviewResponse } from "@/modules/ai/prompts/daily-review";
import type { TaskWithGoal } from "@/modules/tasks/tasks.types";
import BottomSheet from "@/shared/components/ui/bottom-sheet";
import StepIndicator from "@/shared/components/ui/step-indicator";
import { useDailyClose } from "../hooks/use-daily-close";
import CloseStepAiFeedback from "./close-step-ai-feedback";
import CloseStepJournal from "./close-step-journal";
import CloseStepSummary from "./close-step-summary";
import CloseStepTomorrow from "./close-step-tomorrow";

type Mood = "great" | "good" | "okay" | "tough";
type Step = 1 | 2 | 3 | 4;

const TOTAL_STEPS = 4;

type JournalState = {
  reflection: string;
  gratitude: string;
  challenges: string;
  learnings: string;
};

type DailyCloseSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskWithGoal[];
  date: string;
};

export default function DailyCloseSheet({
  isOpen,
  onClose,
  tasks,
  date,
}: DailyCloseSheetProps) {
  const [step, setStep] = useState<Step>(1);
  const [localTasks, setLocalTasks] = useState<TaskWithGoal[]>(tasks);
  const [mood, setMood] = useState<Mood>("good");
  const [journal, setJournal] = useState<JournalState>({
    reflection: "",
    gratitude: "",
    challenges: "",
    learnings: "",
  });
  const [tomorrowFocus, setTomorrowFocus] = useState("");
  const [aiResult, setAiResult] = useState<DailyReviewResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { saveDailyReview, isLoading: isSaving } = useDailyClose();

  const completedTasks = localTasks.filter((t) => t.status === "completed");

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/daily-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completedTasks: completedTasks.map((t) => ({
            title: t.title,
            area: t.area,
          })),
          ...journal,
          tomorrowFocus,
          mood,
          date,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate review");
      const data: DailyReviewResponse = await res.json();
      setAiResult(data);
      setStep(4);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    if (!aiResult) return;
    await saveDailyReview({
      date,
      mood,
      ...journal,
      tomorrowFocus,
      aiSummary: aiResult.feedback.split("\n\n")[0] ?? "",
      aiFeedback: aiResult.feedback,
      aiInsights: aiResult.insights,
      aiNextDayFocus: aiResult.nextDayFocus,
    });
    handleClose();
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep(1);
      setLocalTasks(tasks);
      setMood("good");
      setJournal({
        reflection: "",
        gratitude: "",
        challenges: "",
        learnings: "",
      });
      setTomorrowFocus("");
      setAiResult(null);
    }, 400);
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Close Day">
      <div className="flex flex-col gap-5">
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 1 && (
          <CloseStepSummary
            tasks={localTasks}
            mood={mood}
            onMoodChange={setMood}
            onTasksChange={setLocalTasks}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <CloseStepJournal
            values={journal}
            onChange={setJournal}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <CloseStepTomorrow
            tomorrowFocus={tomorrowFocus}
            onChange={setTomorrowFocus}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        )}
        {step === 4 && aiResult && (
          <CloseStepAiFeedback
            data={aiResult}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
      </div>
    </BottomSheet>
  );
}
