"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Flame, Trash2 } from "lucide-react";
import AreaBadge from "@/shared/components/common/area-badge";
import { AREA_CONFIG } from "@/shared/config/areas";
import { today } from "@/shared/utils/date";
import type { HabitWithStats } from "../habits.types";
import HabitHeatmap from "./habit-heatmap";

const EASING = [0.25, 0, 0, 1] as const;
const DELETE_THRESHOLD = -80;
const DELETE_ANIM_DURATION = 0.25;

type HabitCardProps = {
  habit: HabitWithStats;
  onToggle: (habitId: string, isLogged: boolean) => void;
  onDelete: (habitId: string) => void;
  isPending?: boolean;
};

export default function HabitCard({
  habit,
  onToggle,
  onDelete,
  isPending,
}: HabitCardProps) {
  const config = AREA_CONFIG[habit.area];
  const todayStr = today();
  const isLoggedToday = habit.logs.some((l) => l.date === todayStr);
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-120, -60], [1, 0]);

  function handleDragEnd() {
    if (x.get() < DELETE_THRESHOLD) {
      animate(x, -300, { duration: DELETE_ANIM_DURATION, ease: EASING });
      setTimeout(
        () => onDelete(habit.id),
        DELETE_ANIM_DURATION * 1000 * 0.8,
      );
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
        className="relative flex flex-col gap-2.5 py-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-medium font-body text-text-primary">
              {habit.name}
            </span>
            <div className="flex items-center gap-2">
              <AreaBadge area={habit.area} />
              <span className="flex items-center gap-1 text-sm font-mono text-text-tertiary">
                <Flame
                  size={12}
                  strokeWidth={1.5}
                  style={{ color: config.accent }}
                />
                {habit.streak.current}
                <span className="ml-0.5 opacity-60">
                  / {habit.streak.longest} best
                </span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggle(habit.id, isLoggedToday)}
            disabled={isPending}
            className="flex items-center justify-center min-h-11 min-w-11 rounded-full transition-colors duration-150 disabled:opacity-50"
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
        </div>

        <HabitHeatmap days={habit.heatmap} accent={config.accent} />
      </motion.div>
    </div>
  );
}
