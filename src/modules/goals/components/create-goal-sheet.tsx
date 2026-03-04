"use client";

import { useState } from "react";
import type { GoalRefineResponse } from "@/modules/ai/prompts/goal-refine";
import Button from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import Sheet from "@/shared/components/ui/sheet";
import StepIndicator from "@/shared/components/ui/step-indicator";
import { AREA_CONFIG } from "@/shared/config/areas";
import {
  AREAS,
  type Area,
  MAX_GOALS_PER_AREA,
} from "@/shared/config/constants";
import { useCreateGoal } from "../hooks/use-create-goal";

type CreateGoalSheetProps = {
  open: boolean;
  onClose: () => void;
  goalsByArea: Record<Area, number>;
};

type Step = "input" | "refine";

const TEXTAREA_STYLE = {
  backgroundColor: "var(--color-bg-base)",
  color: "var(--color-text-primary)",
  border: "1px solid var(--color-border-subtle)",
} as const;

async function fetchRefinement(
  title: string,
  description: string,
  area: Area,
): Promise<GoalRefineResponse> {
  const res = await fetch("/api/ai/refine-goal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description: description || null, area }),
  });
  if (!res.ok) throw new Error("Refinement failed");
  return res.json();
}

export default function CreateGoalSheet({
  open,
  onClose,
  goalsByArea,
}: CreateGoalSheetProps) {
  const [step, setStep] = useState<Step>("input");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState<Area>("work");

  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);
  const [refinement, setRefinement] = useState<GoalRefineResponse | null>(null);
  const [refinedTitle, setRefinedTitle] = useState("");
  const [refinedDescription, setRefinedDescription] = useState("");

  const { mutate, isPending, error: saveError, reset } = useCreateGoal();

  function handleClose() {
    setStep("input");
    setTitle("");
    setDescription("");
    setArea("work");
    setRefinement(null);
    setRefineError(null);
    reset();
    onClose();
  }

  function saveGoal(finalTitle: string, finalDescription: string | null) {
    mutate(
      { title: finalTitle, description: finalDescription, area },
      { onSuccess: handleClose },
    );
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setIsRefining(true);
    setRefineError(null);

    try {
      const result = await fetchRefinement(
        title.trim(),
        description.trim(),
        area,
      );

      if (result.isSpecific) {
        saveGoal(title.trim(), description.trim() || null);
        return;
      }

      setRefinement(result);
      setRefinedTitle(result.refinedTitle ?? title.trim());
      setRefinedDescription(result.refinedDescription ?? description.trim());
      setStep("refine");
    } catch {
      setRefineError("Couldn't reach AI — saving as-is.");
      saveGoal(title.trim(), description.trim() || null);
    } finally {
      setIsRefining(false);
    }
  }

  function handleSaveRefined(e: React.FormEvent) {
    e.preventDefault();
    saveGoal(refinedTitle.trim(), refinedDescription.trim() || null);
  }

  return (
    <Sheet open={open} onClose={handleClose} title="New goal">
      <div className="flex flex-col gap-5">
        <StepIndicator currentStep={step === "input" ? 1 : 2} totalSteps={2} />

        {step === "input" ? (
          <form onSubmit={handleContinue} className="flex flex-col gap-5">
            <Input
              placeholder="Goal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              disabled={isRefining}
            />

            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={setDescription}
              disabled={isRefining}
              rows={2}
            />

            <AreaSelector
              area={area}
              setArea={setArea}
              goalsByArea={goalsByArea}
              disabled={isRefining}
            />

            {refineError && (
              <span
                className="text-sm font-body text-text-secondary"
              >
                {refineError}
              </span>
            )}

            <Button
              type="submit"
              disabled={!title.trim()}
              isLoading={isRefining}
            >
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSaveRefined} className="flex flex-col gap-5">
            {refinement?.feedback && (
              <div
                className="rounded-md px-4 py-3 text-sm font-body leading-relaxed"
                style={{
                  backgroundColor: "var(--color-bg-elevated)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {refinement.feedback}
              </div>
            )}

            {refinement?.questions && refinement.questions.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span
                  className="text-xs font-body uppercase tracking-wide text-text-tertiary"
                >
                  Clarifying questions
                </span>
                <ul className="flex flex-col gap-1">
                  {refinement.questions.map((q) => (
                    <li
                      key={q}
                      className="text-sm font-body leading-snug text-text-secondary"
                    >
                      · {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-body uppercase tracking-wide text-text-tertiary"
              >
                Refined goal
              </span>
              <Input
                placeholder="Goal title"
                value={refinedTitle}
                onChange={(e) => setRefinedTitle(e.target.value)}
                autoFocus
                disabled={isPending}
              />
              <Textarea
                placeholder="Description (optional)"
                value={refinedDescription}
                onChange={setRefinedDescription}
                disabled={isPending}
                rows={3}
              />
            </div>

            {saveError && (
              <span
                className="text-sm font-body"
                style={{ color: "var(--color-destructive-text)" }}
              >
                {saveError.message}
              </span>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("input")}
                disabled={isPending}
                className="h-11 px-4 rounded-md text-sm font-medium font-body transition-colors duration-150"
                style={{
                  color: "var(--color-text-secondary)",
                  border: "1.5px solid var(--color-border-subtle)",
                }}
              >
                Back
              </button>
              <Button
                type="submit"
                disabled={!refinedTitle.trim()}
                isLoading={isPending}
                className="flex-1"
              >
                Save goal
              </Button>
            </div>
          </form>
        )}
      </div>
    </Sheet>
  );
}

type TextareaProps = {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  rows: number;
};

function Textarea({
  placeholder,
  value,
  onChange,
  disabled,
  rows,
}: TextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      disabled={disabled}
      className="w-full resize-none rounded-md px-4 py-3 text-sm font-body outline-none transition-colors duration-150"
      style={TEXTAREA_STYLE}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border-default)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border-subtle)";
      }}
    />
  );
}

type AreaSelectorProps = {
  area: Area;
  setArea: (a: Area) => void;
  goalsByArea: Record<Area, number>;
  disabled: boolean;
};

function AreaSelector({
  area,
  setArea,
  goalsByArea,
  disabled,
}: AreaSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-xs font-body uppercase tracking-wide text-text-secondary"
      >
        Area
      </span>
      <div className="flex gap-2">
        {AREAS.map((a) => {
          const config = AREA_CONFIG[a];
          const isSelected = area === a;
          const isDisabled = disabled || goalsByArea[a] >= MAX_GOALS_PER_AREA;

          return (
            <button
              key={a}
              type="button"
              onClick={() => !isDisabled && setArea(a)}
              disabled={isDisabled}
              className="flex-1 h-11 rounded-md text-sm font-medium font-body transition-colors duration-150 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isSelected ? config.subtle : "transparent",
                color: isDisabled
                  ? "var(--color-text-tertiary)"
                  : isSelected
                    ? config.text
                    : "var(--color-text-secondary)",
                border: `1.5px solid ${isSelected ? config.border : "var(--color-border-subtle)"}`,
                opacity: isDisabled ? 0.4 : 1,
              }}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
