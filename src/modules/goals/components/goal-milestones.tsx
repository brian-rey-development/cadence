"use client";

import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Milestone } from "@/modules/ai-engine/ai-engine.types";
import { createTask } from "@/modules/tasks/mutations/create-task";

type GoalMilestonesProps = {
  milestones: Milestone[];
  goalId: string;
  area: "work" | "personal" | "identity";
  accentColor: string;
};

export default function GoalMilestones({
  milestones,
  goalId,
  area,
  accentColor,
}: GoalMilestonesProps) {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => router.refresh(),
  });

  function handleCreateTask(title: string, targetDate: string) {
    mutate({
      userId: "placeholder",
      title,
      area,
      date: targetDate,
      goalId,
      status: "pending",
      postponeCount: 0,
      completedAt: null,
    });
  }

  return (
    <div className="flex flex-col gap-3 pt-2">
      {milestones.map((milestone, index) => (
        <div
          key={`${milestone.title}-${index}`}
          className="flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <span
              className="font-['DM_Sans'] text-[13px] font-medium leading-snug"
              style={{ color: "var(--color-text-primary)" }}
            >
              {milestone.title}
            </span>
            <span
              className="font-['DM_Mono'] text-[10px] ml-auto shrink-0"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {milestone.targetDate}
            </span>
          </div>

          <div className="ml-4 flex flex-col gap-1">
            {milestone.suggestedTasks.map((taskTitle) => (
              <button
                key={taskTitle}
                type="button"
                disabled={isPending}
                onClick={() =>
                  handleCreateTask(taskTitle, milestone.targetDate)
                }
                className="flex items-center gap-1.5 text-left group disabled:opacity-50"
              >
                <Plus
                  size={12}
                  strokeWidth={1.5}
                  style={{ color: accentColor, opacity: 0.7 }}
                  className="shrink-0"
                />
                <span
                  className="font-['DM_Sans'] text-[12px] leading-snug"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {taskTitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
