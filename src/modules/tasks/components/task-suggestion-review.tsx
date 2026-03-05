"use client";

import { Link } from "lucide-react";
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm({
      title: title.trim(),
      area,
      type: taskType,
      date: taskType === "daily" ? selectedDate : null,
      weekStart: taskType === "weekly" ? suggestion.weekStart : null,
      goalId,
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
          className="text-sm font-body font-medium uppercase tracking-widest text-text-tertiary"
        >
          Task
        </label>
        <textarea
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-md px-4 py-3 text-base font-body outline-none transition-colors duration-150"
          style={{
            backgroundColor: "var(--color-bg-base)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border-subtle)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-default)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-subtle)";
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-body font-medium uppercase tracking-widest text-text-tertiary">
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
            <p className="text-sm font-body leading-relaxed text-text-tertiary">
              {suggestion.schedulingReason}
            </p>
          )}
        </div>
      )}

      {goals.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="task-goal"
            className="text-sm font-body font-medium uppercase tracking-widest text-text-tertiary"
          >
            Goal (optional)
          </label>
          <select
            id="task-goal"
            value={goalId ?? ""}
            onChange={(e) => setGoalId(e.target.value || null)}
            className="h-12 w-full rounded-md px-4 text-base font-body outline-none transition-colors duration-150"
            style={{
              backgroundColor: "var(--color-bg-base)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            <option value="">No goal</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
          {goalId === null && (
            <div className="flex items-center gap-1.5 mt-1">
              <Link
                size={12}
                strokeWidth={1.5}
                className="text-text-tertiary"
              />
              <span className="text-sm font-body text-text-tertiary">
                No quarter goal linked
              </span>
            </div>
          )}
        </div>
      )}

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
