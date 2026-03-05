"use client";

import Button from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS, type Area } from "@/shared/config/constants";

const FREQUENCIES = [1, 2, 3, 4, 5, 6, 7] as const;

type HabitFormProps = {
  name: string;
  area: Area;
  frequency: number;
  scheduledTime: string | null;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onAreaChange: (area: Area) => void;
  onFrequencyChange: (freq: number) => void;
  onScheduledTimeChange: (time: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function HabitForm({
  name,
  area,
  frequency,
  scheduledTime,
  isLoading,
  onNameChange,
  onAreaChange,
  onFrequencyChange,
  onScheduledTimeChange,
  onSubmit,
}: HabitFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Input
        placeholder="Habit name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        autoFocus
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-body uppercase tracking-wide text-text-secondary">
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
                onClick={() => onAreaChange(a)}
                className="flex-1 h-11 rounded-md text-base font-medium font-body transition-colors duration-150"
                style={{
                  backgroundColor: isSelected ? config.subtle : "transparent",
                  color: isSelected
                    ? config.text
                    : "var(--color-text-secondary)",
                  border: `1.5px solid ${isSelected ? config.border : "var(--color-border-default)"}`,
                }}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-body uppercase tracking-wide text-text-secondary">
          Times per week
        </span>
        <div className="flex gap-2">
          {FREQUENCIES.map((f) => {
            const isSelected = frequency === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => onFrequencyChange(f)}
                className="flex-1 h-11 rounded-full text-base font-mono transition-colors duration-150"
                style={{
                  backgroundColor: isSelected
                    ? "var(--color-text-primary)"
                    : "transparent",
                  color: isSelected
                    ? "var(--color-bg-base)"
                    : "var(--color-text-secondary)",
                  border: `1.5px solid ${isSelected ? "var(--color-text-primary)" : "var(--color-border-default)"}`,
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-body uppercase tracking-wide text-text-secondary">
            Reminder time
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={scheduledTime !== null}
            onClick={() =>
              onScheduledTimeChange(scheduledTime !== null ? null : "09:00")
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
            aria-label="Reminder time"
            value={scheduledTime}
            onChange={(e) => onScheduledTimeChange(e.target.value)}
            className="w-full h-11 rounded-md px-4 font-mono text-base text-text-secondary outline-none"
            style={{
              backgroundColor: "var(--color-bg-base)",
              border: "1.5px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
          />
        )}
      </div>

      <Button type="submit" disabled={!name.trim()} isLoading={isLoading}>
        Continue
      </Button>
    </form>
  );
}
