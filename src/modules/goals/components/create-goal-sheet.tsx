"use client";

import { useState } from "react";
import Button from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import Sheet from "@/shared/components/ui/sheet";
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

export default function CreateGoalSheet({
  open,
  onClose,
  goalsByArea,
}: CreateGoalSheetProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState<Area>("work");
  const { mutate, isPending, error, reset } = useCreateGoal();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    mutate(
      { title: title.trim(), description: description.trim() || null, area },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setArea("work");
          reset();
          onClose();
        },
      },
    );
  }

  return (
    <Sheet open={open} onClose={onClose} title="New goal">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          placeholder="Goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-[10px] px-4 py-3 text-[14px] font-['DM_Sans'] outline-none transition-colors duration-150"
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

        <div className="flex flex-col gap-2">
          <span
            className="text-[12px] font-['DM_Sans'] uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Area
          </span>
          <div className="flex gap-2">
            {AREAS.map((a) => {
              const config = AREA_CONFIG[a];
              const isSelected = area === a;
              const isDisabled = goalsByArea[a] >= MAX_GOALS_PER_AREA;

              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => !isDisabled && setArea(a)}
                  disabled={isDisabled}
                  className="flex-1 h-11 rounded-[10px] text-[13px] font-medium font-['DM_Sans'] transition-colors duration-150 disabled:cursor-not-allowed"
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

        {error && (
          <span
            className="text-[13px] font-['DM_Sans']"
            style={{ color: "var(--color-destructive-text)" }}
          >
            {error.message}
          </span>
        )}

        <Button type="submit" disabled={!title.trim()} isLoading={isPending}>
          Add goal
        </Button>
      </form>
    </Sheet>
  );
}
