"use client";

import { useState } from "react";
import type { GoalModel } from "@/db/schema/goals";
import type { CreateTaskResponse } from "@/modules/ai/prompts/create-task";
import Button from "@/shared/components/ui/button";
import type { Area } from "@/shared/config/constants";
import AreaSelector from "./area-selector";
import DateSelector from "./date-selector";

type TaskType = "daily" | "weekly" | "quarterly";

const TYPE_LABELS: Record<TaskType, string> = {
  daily: "Daily",
  weekly: "Weekly",
  quarterly: "Quarterly",
};

type TaskSuggestionReviewProps = {
  suggestion: CreateTaskResponse;
  goals: GoalModel[];
  date: string;
  onConfirm: (data: {
    title: string;
    area: Area;
    type: TaskType;
    date: string | null;
    weekStart: string | null;
    goalId: string | null;
    scheduledTime: string | null;
  }) => void;
  isSubmitting: boolean;
};

export default function TaskSuggestionReview({
  suggestion,
  goals,
  date,
  onConfirm,
  isSubmitting,
}: TaskSuggestionReviewProps) {
  const [title, setTitle] = useState(suggestion.title);
  const [area, setArea] = useState<Area>(suggestion.area);
  const [taskType, setTaskType] = useState<TaskType>(
    suggestion.type ?? "daily",
  );
  const [selectedDate, setSelectedDate] = useState(suggestion.date ?? date);
  const [goalId, setGoalId] = useState<string | null>(suggestion.goalId);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm({
      title: title.trim(),
      area,
      type: taskType,
      date: taskType === "daily" ? selectedDate : null,
      weekStart: taskType === "weekly" ? suggestion.weekStart : null,
      goalId,
      scheduledTime,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
      {suggestion.warning && (
        <div
          className="rounded-md px-4 py-3 text-base font-body"
          style={{
            backgroundColor: "var(--color-warning-subtle)",
            color: "var(--color-warning-text)",
            border: "1px solid var(--color-warning-subtle)",
          }}
        >
          {suggestion.warning}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="task-title"
          className="text-sm font-body font-medium uppercase tracking-label text-text-secondary"
        >
          Task
        </label>
        <textarea
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-md px-4 py-3 text-base font-body outline-none transition-colors duration-150 focus:border-border-default"
          style={{
            backgroundColor: "var(--color-bg-base)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border-default)",
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-body font-medium uppercase tracking-label text-text-secondary">
          Type
        </span>
        <div className="flex gap-2">
          {(["daily", "weekly", "quarterly"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTaskType(t)}
              className="rounded-full px-3 py-1.5 text-base font-body font-medium transition-colors duration-150"
              style={{
                backgroundColor:
                  taskType === t
                    ? "var(--color-text-primary)"
                    : "var(--color-bg-elevated)",
                color:
                  taskType === t
                    ? "var(--color-bg-base)"
                    : "var(--color-text-secondary)",
              }}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <AreaSelector area={area} onChange={setArea} />
      {taskType === "daily" && (
        <div className="flex flex-col gap-1.5">
          <DateSelector
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
          {suggestion.schedulingReason && (
            <p className="text-sm font-body leading-relaxed text-text-secondary">
              {suggestion.schedulingReason}
            </p>
          )}
        </div>
      )}

      {goals.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-body font-medium uppercase tracking-label text-text-secondary">
            Goal (optional)
          </span>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            <button
              type="button"
              onClick={() => setGoalId(null)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-base font-body transition-colors duration-150"
              style={{
                backgroundColor:
                  goalId === null
                    ? "var(--color-text-primary)"
                    : "var(--color-bg-elevated)",
                color:
                  goalId === null
                    ? "var(--color-bg-base)"
                    : "var(--color-text-secondary)",
              }}
            >
              No goal
            </button>
            {goals.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoalId(g.id)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-base font-body transition-colors duration-150"
                style={{
                  backgroundColor:
                    goalId === g.id
                      ? "var(--color-text-primary)"
                      : "var(--color-bg-elevated)",
                  color:
                    goalId === g.id
                      ? "var(--color-bg-base)"
                      : "var(--color-text-secondary)",
                }}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(--color-${g.area}-accent)` }}
                />
                {g.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-body font-medium uppercase tracking-label text-text-secondary">
            Set a time
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={scheduledTime !== null}
            onClick={() =>
              setScheduledTime(scheduledTime !== null ? null : "09:00")
            }
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
              scheduledTime !== null
                ? "bg-[var(--color-text-primary)]"
                : "bg-[var(--color-border-default)]"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                scheduledTime !== null ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        {scheduledTime !== null && (
          <input
            type="time"
            aria-label="Scheduled time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full h-11 rounded-md px-4 font-mono text-base outline-none"
            style={{
              backgroundColor: "var(--color-bg-base)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
          />
        )}
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={!title.trim() || isSubmitting}
        className="w-full mt-2"
      >
        Add task
      </Button>
    </form>
  );
}
