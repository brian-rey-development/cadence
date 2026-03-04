"use client";

import { Link } from "lucide-react";
import { useState } from "react";
import type { GoalModel } from "@/db/schema/goals";
import type { CreateTaskResponse } from "@/modules/ai/prompts/create-task";
import Button from "@/shared/components/ui/button";
import { AREA_CONFIG } from "@/shared/config/areas";
import type { Area } from "@/shared/config/constants";
import { AREAS } from "@/shared/config/constants";
import { cn } from "@/shared/utils/cn";
import { today, toISODate } from "@/shared/utils/date";

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

const DATE_OPTIONS = [
  { label: "Today", getValue: () => today() },
  {
    label: "Tomorrow",
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return toISODate(d);
    },
  },
];

const LEGEND_CLASS =
  "text-xs font-['DM_Sans'] font-medium uppercase tracking-widest mb-1.5";
const LEGEND_STYLE = { color: "var(--color-text-tertiary)" };

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

  const tomorrowISO = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toISODate(d);
  })();

  const activeDateOption =
    selectedDate === today()
      ? "Today"
      : selectedDate === tomorrowISO
        ? "Tomorrow"
        : null;

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
            backgroundColor: "rgba(202, 170, 106, 0.12)",
            color: "#CAAA6A",
            border: "1px solid rgba(202, 170, 106, 0.25)",
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

      <fieldset className="border-0 p-0 m-0 flex flex-col">
        <legend className={LEGEND_CLASS} style={LEGEND_STYLE}>
          Area
        </legend>
        <div className="flex gap-2">
          {AREAS.map((a) => {
            const config = AREA_CONFIG[a];
            const isSelected = area === a;
            return (
              <button
                key={a}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setArea(a)}
                className="flex-1 rounded-[10px] py-2.5 text-[13px] font-medium font-['DM_Sans'] transition-colors duration-150 min-h-[44px]"
                style={{
                  backgroundColor: isSelected ? config.subtle : "transparent",
                  color: isSelected
                    ? config.text
                    : "var(--color-text-tertiary)",
                  border: isSelected
                    ? `1px solid ${config.border}`
                    : "1px solid var(--color-border-subtle)",
                }}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0 m-0 flex flex-col">
        <legend className={LEGEND_CLASS} style={LEGEND_STYLE}>
          When
        </legend>
        <div className="flex gap-2">
          {DATE_OPTIONS.map(({ label, getValue }) => {
            const val = getValue();
            const isSelected = activeDateOption === label;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedDate(val)}
                className={cn(
                  "flex-1 rounded-[10px] py-2.5 text-[13px] font-['DM_Sans'] font-medium transition-colors duration-150 min-h-[44px]",
                )}
                style={{
                  backgroundColor: isSelected
                    ? "var(--color-bg-base)"
                    : "transparent",
                  color: isSelected
                    ? "var(--color-text-primary)"
                    : "var(--color-text-tertiary)",
                  border: isSelected
                    ? "1px solid var(--color-border-default)"
                    : "1px solid var(--color-border-subtle)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

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
