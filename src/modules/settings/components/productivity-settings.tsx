"use client";

import {
  DAILY_TASK_LIMIT,
  MAX_GOALS_PER_AREA,
} from "@/shared/config/constants";
import { useSaveSettings, useUserSettings } from "../hooks/use-user-settings";
import type { UserSettings } from "../settings.types";

type ProductivitySettingsProps = {
  initialSettings: UserSettings | undefined;
};

const MIN_DAILY = 1;
const MAX_DAILY = 20;
const MIN_WEEKLY = 1;
const MAX_WEEKLY = 10;

export default function ProductivitySettings({
  initialSettings,
}: ProductivitySettingsProps) {
  const { data: settings } = useUserSettings(initialSettings);
  const { mutate: saveSettings } = useSaveSettings();

  const dailyTaskLimit = settings?.dailyTaskLimit ?? DAILY_TASK_LIMIT;
  const weeklyGoalLimit = settings?.weeklyGoalLimit ?? MAX_GOALS_PER_AREA;

  return (
    <div className="flex flex-col gap-1">
      <p className="font-[family-name:var(--font-body)] text-sm font-medium uppercase tracking-widest text-text-tertiary">
        Productivity
      </p>

      <div className="mt-2 flex flex-col gap-px overflow-hidden rounded-2xl bg-[var(--color-bg-elevated)]">
        <StepperRow
          label="Daily task limit"
          hint="Recommended: 7"
          value={dailyTaskLimit}
          min={MIN_DAILY}
          max={MAX_DAILY}
          onChange={(v) => saveSettings({ dailyTaskLimit: v })}
        />

        <div style={{ borderTop: "1px solid var(--color-border-subtle)" }} />

        <StepperRow
          label="Weekly goals per area"
          hint="Recommended: 3"
          value={weeklyGoalLimit}
          min={MIN_WEEKLY}
          max={MAX_WEEKLY}
          onChange={(v) => saveSettings({ weeklyGoalLimit: v })}
        />
      </div>
    </div>
  );
}

type StepperRowProps = {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
};

function StepperRow({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: StepperRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="font-[family-name:var(--font-body)] text-base text-text-primary">
          {label}
        </span>
        <span className="font-[family-name:var(--font-body)] text-xs text-text-tertiary">
          {hint}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-bg-base)] text-lg text-text-primary transition-opacity disabled:opacity-30"
        >
          −
        </button>
        <span className="w-6 text-center font-mono text-base text-text-primary tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-bg-base)] text-lg text-text-primary transition-opacity disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}
