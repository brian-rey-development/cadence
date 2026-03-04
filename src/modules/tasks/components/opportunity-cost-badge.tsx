"use client";

import { Zap } from "lucide-react";
import { useState } from "react";
import BottomSheet from "@/shared/components/ui/bottom-sheet";

type OpportunityCostBadgeProps = {
  count: number;
  reasoning: string;
  areaColor: string;
};

export default function OpportunityCostBadge({
  count,
  reasoning,
  areaColor,
}: OpportunityCostBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full shrink-0"
        style={{ backgroundColor: `${areaColor}20` }}
        aria-label={`Defers ${count} task${count === 1 ? "" : "s"} — tap for details`}
      >
        <Zap size={10} strokeWidth={1.5} style={{ color: areaColor }} />
        <span
          className="font-mono text-2xs leading-none"
          style={{ color: areaColor }}
        >
          {count}
        </span>
      </button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Opportunity cost"
      >
        <div className="flex flex-col gap-4 pt-2 pb-4">
          <p
            className="font-body text-sm leading-relaxed text-text-secondary"
          >
            {reasoning}
          </p>
          <p
            className="font-body text-xs text-text-tertiary"
          >
            Prioritizing this task defers{" "}
            <span className="text-text-primary">
              {count} other task{count === 1 ? "" : "s"}
            </span>{" "}
            competing for the same energy.
          </p>
        </div>
      </BottomSheet>
    </>
  );
}
