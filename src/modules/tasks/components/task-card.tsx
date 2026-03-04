"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Trash2 } from "lucide-react";
import Checkbox from "@/shared/components/ui/checkbox";
import { AREA_CONFIG } from "@/shared/config/areas";
import type { TaskWithGoal } from "../tasks.types";
import { getZombieAge, isZombie } from "../utils/zombie";
import ZombieBadge from "./zombie-badge";

const EASING = [0.25, 0, 0, 1] as const;
const ARCHIVE_THRESHOLD = -80;
const ARCHIVE_ANIM_DURATION = 0.25;

type TaskCardProps = {
  task: TaskWithGoal;
  onComplete: (id: string) => void;
  onArchive: (id: string) => void;
};

export default function TaskCard({
  task,
  onComplete,
  onArchive,
}: TaskCardProps) {
  const isDone = task.status === "completed";
  const zombieAge = !isDone && isZombie(task) ? getZombieAge(task) : null;
  const areaColor = AREA_CONFIG[task.area].accent;
  const x = useMotionValue(0);
  const archiveOpacity = useTransform(x, [-120, -60], [1, 0]);

  function handleDragEnd() {
    if (x.get() < ARCHIVE_THRESHOLD) {
      animate(x, -300, { duration: ARCHIVE_ANIM_DURATION, ease: EASING });
      setTimeout(() => onArchive(task.id), ARCHIVE_ANIM_DURATION * 1000 * 0.8);
    } else {
      animate(x, 0, { duration: 0.3, ease: EASING });
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[10px]">
      {/* Archive reveal layer */}
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 rounded-[10px]"
        style={{
          opacity: archiveOpacity,
          backgroundColor: "var(--color-destructive-subtle)",
        }}
      >
        <Trash2
          size={18}
          strokeWidth={1.5}
          aria-label="Archive task"
          style={{ color: "var(--color-destructive)" }}
        />
      </motion.div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        style={{
          x,
          backgroundColor: isDone
            ? "var(--color-bg-base)"
            : "var(--color-bg-surface)",
          opacity: isDone ? 0.6 : 1,
          border:
            zombieAge !== null
              ? "1px solid var(--color-zombie)"
              : "1px solid var(--color-border-subtle)",
        }}
        onDragEnd={handleDragEnd}
        className="relative flex items-center gap-3 rounded-[10px] min-h-[56px] px-4 py-[14px]"
      >
        {/* Area bar */}
        <div
          className="absolute left-0 inset-y-2 w-[3px] rounded-full"
          style={{ backgroundColor: areaColor }}
        />

        <div className="ml-2">
          <Checkbox
            checked={isDone}
            onChange={() => !isDone && onComplete(task.id)}
            disabled={isDone}
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span
              className="font-['DM_Sans'] text-sm leading-snug truncate"
              style={{
                color: "var(--color-text-primary)",
                textDecoration: isDone ? "line-through" : "none",
                opacity: isDone ? 0.5 : 1,
              }}
            >
              {task.title}
            </span>
            {zombieAge !== null && <ZombieBadge daysOld={zombieAge} />}
          </div>
          {task.goal && (
            <span
              className="font-['DM_Sans'] text-[11px] truncate"
              style={{ color: areaColor, opacity: 0.7 }}
            >
              {task.goal.title}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
