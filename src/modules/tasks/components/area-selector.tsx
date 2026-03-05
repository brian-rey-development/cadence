"use client";

import { AREA_CONFIG } from "@/shared/config/areas";
import type { Area } from "@/shared/config/constants";
import { AREAS } from "@/shared/config/constants";

const LEGEND_CLASS =
  "text-sm font-body font-medium uppercase tracking-widest mb-1.5";
const LEGEND_STYLE = { color: "var(--color-text-tertiary)" };

type AreaSelectorProps = {
  area: Area;
  onChange: (area: Area) => void;
};

export default function AreaSelector({ area, onChange }: AreaSelectorProps) {
  return (
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
              onClick={() => onChange(a)}
              className="flex-1 rounded-md py-2.5 text-base font-medium font-body transition-colors duration-150 min-h-11"
              style={{
                backgroundColor: isSelected ? config.subtle : "transparent",
                color: isSelected ? config.text : "var(--color-text-tertiary)",
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
  );
}
