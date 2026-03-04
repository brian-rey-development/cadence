"use client";

import { useState } from "react";
import Button from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import Sheet from "@/shared/components/ui/sheet";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS, type Area } from "@/shared/config/constants";
import { useCreateHabit } from "../hooks/use-create-habit";

type CreateHabitSheetProps = {
  open: boolean;
  onClose: () => void;
};

const FREQUENCIES = [1, 2, 3, 4, 5, 6, 7] as const;

export default function CreateHabitSheet({
  open,
  onClose,
}: CreateHabitSheetProps) {
  const [name, setName] = useState("");
  const [area, setArea] = useState<Area>("work");
  const [frequency, setFrequency] = useState(7);
  const { mutate, isPending } = useCreateHabit();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    mutate(
      { name: name.trim(), area, weeklyFrequency: frequency },
      {
        onSuccess: () => {
          setName("");
          setArea("work");
          setFrequency(7);
          onClose();
        },
      },
    );
  }

  return (
    <Sheet open={open} onClose={onClose} title="New habit">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          placeholder="Habit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
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
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  className="flex-1 h-11 rounded-[10px] text-[13px] font-medium font-['DM_Sans'] transition-colors duration-150"
                  style={{
                    backgroundColor: isSelected ? config.subtle : "transparent",
                    color: isSelected
                      ? config.text
                      : "var(--color-text-secondary)",
                    border: `1.5px solid ${isSelected ? config.border : "var(--color-border-subtle)"}`,
                  }}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span
            className="text-[12px] font-['DM_Sans'] uppercase tracking-wide"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Times per week
          </span>
          <div className="flex gap-2">
            {FREQUENCIES.map((f) => {
              const isSelected = frequency === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className="flex-1 h-11 rounded-full text-[14px] font-['DM_Mono'] transition-colors duration-150"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--color-text-primary)"
                      : "transparent",
                    color: isSelected
                      ? "var(--color-bg-base)"
                      : "var(--color-text-secondary)",
                    border: `1.5px solid ${isSelected ? "var(--color-text-primary)" : "var(--color-border-subtle)"}`,
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <Button type="submit" disabled={!name.trim()} isLoading={isPending}>
          Add habit
        </Button>
      </form>
    </Sheet>
  );
}
