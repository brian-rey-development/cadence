"use client";

import { Link } from "lucide-react";
import { useState } from "react";
import type { GoalModel } from "@/db/schema/goals";
import type { CreateTaskResponse } from "@/modules/ai/prompts/create-task";
import Button from "@/shared/components/ui/button";
import type { Area } from "@/shared/config/constants";
import AreaSelector from "./area-selector";
import DateSelector from "./date-selector";

type TaskSuggestionReviewProps = {
  suggestion: CreateTaskResponse;
  goals: GoalModel[];
  date: string;
  onConfirm: (data: {
    title: string;
    area: Area;
    date: string;
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
  const [selectedDate, setSelectedDate] = useState(suggestion.date ?? date);
  const [goalId, setGoalId] = useState<string | null>(suggestion.goalId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm({ title: title.trim(), area, date: selectedDate, goalId });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
      {suggestion.warning && (
        <div
          className="rounded-[10px] px-4 py-3 text-[13px] font-['DM_Sans']"
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
          className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Task
        </label>
        <textarea
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-[10px] px-4 py-3 text-[15px] font-['DM_Sans'] outline-none transition-colors duration-150"
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

      <AreaSelector area={area} onChange={setArea} />
      <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />

      {goals.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="task-goal"
            className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Goal (optional)
          </label>
          <select
            id="task-goal"
            value={goalId ?? ""}
            onChange={(e) => setGoalId(e.target.value || null)}
            className="h-12 w-full rounded-[10px] px-4 text-[15px] font-['DM_Sans'] outline-none transition-colors duration-150"
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
                style={{ color: "var(--color-text-tertiary)" }}
              />
              <span
                className="text-[12px] font-['DM_Sans']"
                style={{ color: "var(--color-text-tertiary)" }}
              >
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
