"use client";

import { useState } from "react";
import type { TaskWithGoal } from "@/modules/tasks/tasks.types";
import BottomSheet from "@/shared/components/ui/bottom-sheet";
import StepIndicator from "@/shared/components/ui/step-indicator";
import { useDailyClose } from "../hooks/use-daily-close";
import CloseStepCompleted from "./close-step-completed";
import CloseStepIncomplete from "./close-step-incomplete";
import CloseStepReflection from "./close-step-reflection";

const TOTAL_STEPS = 3;

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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [localTasks, setLocalTasks] = useState<TaskWithGoal[]>(tasks);
  const { postponeTask, archiveTask } = useDailyClose();

  const completedTasks = localTasks.filter((t) => t.status === "completed");
  const incompleteTasks = localTasks.filter((t) => t.status === "pending");

  function removeTask(taskId: string) {
    setLocalTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function handlePostpone(taskId: string, toDate: string) {
    postponeTask({ taskId, toDate });
    removeTask(taskId);
  }

  function handleArchive(taskId: string) {
    archiveTask(taskId);
    removeTask(taskId);
  }

  function handleClose() {
    setStep(1);
    setLocalTasks(tasks);
    onClose();
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Close Day">
      <div className="flex flex-col gap-5">
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 1 && (
          <CloseStepCompleted tasks={localTasks} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <CloseStepIncomplete
            tasks={incompleteTasks}
            onNext={() => setStep(3)}
            onPostpone={handlePostpone}
            onArchive={handleArchive}
          />
        )}
        {step === 3 && (
          <CloseStepReflection
            completedTasks={completedTasks}
            date={date}
            onClose={handleClose}
          />
        )}
      </div>
    </BottomSheet>
  );
}
