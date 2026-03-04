"use client";

import type { TaskWithGoal } from "@/modules/tasks/tasks.types";
import { getZombieAge, isZombie } from "@/modules/tasks/utils/zombie";
import { AREA_CONFIG } from "@/shared/config/areas";
import { toISODate } from "@/shared/utils/date";

type ZombieResolutionCardProps = {
  task: TaskWithGoal;
  onPostpone: (toDate: string) => void;
  onArchive: () => void;
  onReformulate: () => void;
};

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISODate(d);
}

export default function ZombieResolutionCard({
  task,
  onPostpone,
  onArchive,
  onReformulate,
}: ZombieResolutionCardProps) {
  const zombie = isZombie(task);
  const age = getZombieAge(task);
  const config = AREA_CONFIG[task.area];

  return (
    <div
      className="flex flex-col gap-3 pl-4 py-3"
      style={{
        borderLeft: `2px solid ${zombie ? "var(--color-zombie)" : config.accent}`,
      }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`font-body text-sm flex-1 ${zombie ? "text-zombie-text" : "text-text-primary"}`}
        >
          {task.title}
        </span>
        {task.postponeCount > 0 && (
          <span className="font-mono text-xs text-text-tertiary">
            ×{task.postponeCount}
          </span>
        )}
        {zombie && (
          <span className="font-mono text-xs text-zombie-text opacity-80">
            {age}d stale
          </span>
        )}
      </div>

      <div className="flex gap-3">
        {zombie && (
          <button
            type="button"
            onClick={onReformulate}
            className="font-body text-xs font-medium transition-opacity active:opacity-50 min-h-9"
            style={{ color: config.text }}
          >
            Reformulate
          </button>
        )}
        <button
          type="button"
          onClick={() => onPostpone(tomorrow())}
          className="font-body text-xs font-medium transition-opacity active:opacity-50 min-h-9 text-text-secondary"
        >
          Tomorrow
        </button>
        <button
          type="button"
          onClick={onArchive}
          className="font-body text-xs font-medium transition-opacity active:opacity-50 min-h-9 text-destructive"
        >
          Archive
        </button>
      </div>
    </div>
  );
}
