"use client";

import { cn } from "@/shared/utils/cn";
import { today, toISODate } from "@/shared/utils/date";

const LEGEND_CLASS =
  "text-xs font-body font-medium uppercase tracking-widest mb-1.5";
const LEGEND_STYLE = { color: "var(--color-text-tertiary)" };

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

type DateSelectorProps = {
  selectedDate: string;
  onChange: (date: string) => void;
};

export default function DateSelector({
  selectedDate,
  onChange,
}: DateSelectorProps) {
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

  return (
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
              onClick={() => onChange(val)}
              className={cn(
                "flex-1 rounded-md py-2.5 text-sm font-body font-medium transition-colors duration-150 min-h-11",
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
  );
}
