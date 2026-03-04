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
      className="relative rounded-xl px-4 py-3 flex flex-col gap-3"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        border: zombie
          ? "1px solid var(--color-zombie)"
          : "1px solid var(--color-border-subtle)",
      }}
    >
      <div
        className="absolute left-0 inset-y-2 w-[3px] rounded-full"
        style={{ backgroundColor: config.accent }}
      />

      <div className="ml-2 flex items-center gap-2 flex-wrap">
        <span
          className="font-['DM_Sans'] text-sm flex-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          {task.title}
        </span>
        {task.postponeCount > 0 && (
          <span
            className="font-['DM_Mono'] text-xs px-1.5 py-0.5 rounded"
            style={{
              color: "var(--color-text-tertiary)",
              backgroundColor: "var(--color-bg-elevated)",
            }}
          >
            x{task.postponeCount}
          </span>
        )}
        {zombie && (
          <span
            className="font-['DM_Mono'] text-xs px-1.5 py-0.5 rounded"
            style={{
              color: "var(--color-zombie-text)",
              backgroundColor: "var(--color-status-zombie-subtle)",
              border: "1px solid var(--color-zombie)",
            }}
          >
            {age}d stale
          </span>
        )}
      </div>

      <div className="ml-2 flex gap-2">
        {zombie && (
          <button
            type="button"
            onClick={onReformulate}
            className="flex-1 min-h-[36px] rounded-lg font-['DM_Sans'] text-xs font-medium transition-opacity active:opacity-70"
            style={{
              backgroundColor: config.subtle,
              color: config.text,
            }}
          >
            Reformulate
          </button>
        )}
        <button
          type="button"
          onClick={() => onPostpone(tomorrow())}
          className="flex-1 min-h-[36px] rounded-lg font-['DM_Sans'] text-xs font-medium transition-opacity active:opacity-70"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            color: "var(--color-text-secondary)",
          }}
        >
          Tomorrow
        </button>
        <button
          type="button"
          onClick={onArchive}
          className="flex-1 min-h-[36px] rounded-lg font-['DM_Sans'] text-xs font-medium transition-opacity active:opacity-70"
          style={{
            backgroundColor: "var(--color-destructive-subtle)",
            color: "var(--color-destructive)",
          }}
        >
          Archive
        </button>
      </div>
    </div>
  );
}
