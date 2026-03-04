"use client";

import type { TaskWithGoal } from "@/modules/tasks/tasks.types";
import { AREA_CONFIG } from "@/shared/config/areas";
import { useDailyClose } from "../hooks/use-daily-close";

type Mood = "great" | "good" | "okay" | "tough";

const MOODS: { value: Mood; label: string }[] = [
  { value: "great", label: "Great" },
  { value: "good", label: "Good" },
  { value: "okay", label: "Okay" },
  { value: "tough", label: "Tough" },
];

type CloseStepSummaryProps = {
  tasks: TaskWithGoal[];
  mood: Mood;
  onMoodChange: (mood: Mood) => void;
  onTasksChange: (tasks: TaskWithGoal[]) => void;
  onNext: () => void;
};

export default function CloseStepSummary({
  tasks,
  mood,
  onMoodChange,
  onTasksChange,
  onNext,
}: CloseStepSummaryProps) {
  const completed = tasks.filter((t) => t.status === "completed");
  const incomplete = tasks.filter((t) => t.status === "pending");
  const { postponeTask, archiveTask } = useDailyClose();

  async function handlePostpone(taskId: string, toDate: string) {
    await postponeTask({ taskId, toDate });
    onTasksChange(tasks.filter((t) => t.id !== taskId));
  }

  async function handleArchive(taskId: string) {
    await archiveTask(taskId);
    onTasksChange(tasks.filter((t) => t.id !== taskId));
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span
          className="text-xs font-medium font-body uppercase tracking-widest text-text-tertiary"
        >
          How did today feel?
        </span>
        <div className="flex gap-2">
          {MOODS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onMoodChange(value)}
              className="flex-1 rounded-xl py-2.5 text-sm font-body font-medium transition-colors duration-150"
              style={{
                backgroundColor:
                  mood === value
                    ? "var(--color-text-primary)"
                    : "var(--color-bg-elevated)",
                color:
                  mood === value
                    ? "var(--color-bg-base)"
                    : "var(--color-text-secondary)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {completed.length > 0 && (
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-medium font-body uppercase tracking-widest text-text-tertiary"
          >
            Completed ({completed.length})
          </span>
          <ul className="flex flex-col gap-1.5">
            {completed.map((task) => (
              <li
                key={task.id}
                className="relative flex items-center gap-3 rounded-xl px-4 py-3 min-h-11 bg-bg-elevated"
              >
                <div
                  className="absolute left-0 inset-y-2 w-[3px] rounded-full"
                  style={{ backgroundColor: AREA_CONFIG[task.area].accent }}
                />
                <span
                  className="font-body text-sm ml-2 text-text-secondary"
                >
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {incomplete.length > 0 && (
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-medium font-body uppercase tracking-widest text-text-tertiary"
          >
            To handle ({incomplete.length})
          </span>
          <ul className="flex flex-col gap-1.5">
            {incomplete.map((task) => (
              <li
                key={task.id}
                className="flex flex-col gap-2 rounded-xl px-4 py-3 bg-bg-elevated"
              >
                <span
                  className="font-body text-sm text-text-primary"
                >
                  {task.title}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handlePostpone(task.id, tomorrowISO)}
                    className="flex-1 min-h-9 rounded-lg font-body text-xs"
                    style={{
                      backgroundColor: "var(--color-bg-surface)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => handleArchive(task.id)}
                    className="flex-1 min-h-9 rounded-lg font-body text-xs"
                    style={{
                      backgroundColor: "var(--color-bg-surface)",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    Archive
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="min-h-11 w-full rounded-xl font-body text-sm font-medium transition-opacity active:opacity-70"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
        }}
      >
        Continue
      </button>
    </div>
  );
}
