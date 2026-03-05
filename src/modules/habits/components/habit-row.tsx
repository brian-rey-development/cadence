"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Trash2 } from "lucide-react";
import { AREA_CONFIG } from "@/shared/config/areas";
import type { HabitWithStats } from "../habits.types";

const EASING = [0.25, 0, 0, 1] as const;
const DELETE_THRESHOLD = -80;
const DELETE_ANIM_DURATION = 0.25;

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")}${period}`;
}

type HabitRowProps = {
  habit: HabitWithStats;
  isLoggedToday: boolean;
  onToggle: (habitId: string, isLogged: boolean) => void;
  onDelete: (habitId: string) => void;
  isPending?: boolean;
};

export default function HabitRow({
  habit,
  isLoggedToday,
  onToggle,
  onDelete,
  isPending,
}: HabitRowProps) {
  const config = AREA_CONFIG[habit.area];
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-120, -60], [1, 0]);

  function handleDragEnd() {
    if (x.get() < DELETE_THRESHOLD) {
      animate(x, -300, { duration: DELETE_ANIM_DURATION, ease: EASING });
      setTimeout(() => onDelete(habit.id), DELETE_ANIM_DURATION * 1000 * 0.8);
    } else {
      animate(x, 0, { duration: 0.3, ease: EASING });
    }
  }

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-4 bg-destructive-subtle"
        style={{ opacity: deleteOpacity }}
      >
        <Trash2
          size={18}
          strokeWidth={1.5}
          aria-label="Delete habit"
          className="text-destructive"
        />
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="relative flex items-center justify-between gap-3 min-h-11 py-2.5"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: config.accent }}
          />
          <span className="font-body text-base text-text-primary truncate">
            {habit.name}
          </span>
          {habit.scheduledTime && (
            <span className="font-mono text-sm text-text-tertiary shrink-0">
              {formatTime(habit.scheduledTime)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onToggle(habit.id, isLoggedToday)}
          disabled={isPending}
          className="flex items-center justify-center min-h-11 min-w-11 rounded-full transition-colors duration-150 disabled:opacity-50 shrink-0"
          style={{
            backgroundColor: isLoggedToday ? config.accent : "transparent",
            border: `1.5px solid ${isLoggedToday ? config.accent : config.border}`,
          }}
          aria-label={isLoggedToday ? "Unlog habit" : "Log habit"}
        >
          {isLoggedToday && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-bg-base"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      </motion.div>
    </div>
  );
}
