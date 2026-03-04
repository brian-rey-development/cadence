"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { AiTaskScore } from "@/modules/ai-engine/ai-engine.types";
import Checkbox from "@/shared/components/ui/checkbox";
import { AREA_CONFIG } from "@/shared/config/areas";
import type { TaskWithGoal } from "../tasks.types";
import { getZombieAge, isZombie } from "../utils/zombie";
import OpportunityCostBadge from "./opportunity-cost-badge";
import ZombieBadge from "./zombie-badge";

const EASING = [0.25, 0, 0, 1] as const;
const ARCHIVE_THRESHOLD = -80;
const ARCHIVE_ANIM_DURATION = 0.25;
const IMPACT_SEGMENTS = 4;

type TaskCardProps = {
  task: TaskWithGoal;
  score?: AiTaskScore;
  onComplete: (id: string) => void;
  onArchive: (id: string) => void;
};

const SEGMENT_KEYS = ["a", "b", "c", "d"] as const;

function ImpactBar({ score, color }: { score: number; color: string }) {
  const filled = Math.round(Number(score) * IMPACT_SEGMENTS);
  return (
    <div
      role="img"
      className="flex items-center gap-0.5"
      aria-label={`Impact: ${filled}/${IMPACT_SEGMENTS}`}
    >
      {SEGMENT_KEYS.map((key, i) => (
        <div
          key={key}
          className="h-1 w-3 rounded-full"
          style={{
            backgroundColor: i < filled ? color : "var(--color-border-subtle)",
          }}
        />
      ))}
    </div>
  );
}

export default function TaskCard({
  task,
  score,
  onComplete,
  onArchive,
}: TaskCardProps) {
  const isDone = task.status === "completed";
  const zombieAge = !isDone && isZombie(task) ? getZombieAge(task) : null;
  const areaColor = AREA_CONFIG[task.area].accent;
  const x = useMotionValue(0);
  const archiveOpacity = useTransform(x, [-120, -60], [1, 0]);
  const opportunityCostCount = score?.opportunityCost?.length ?? 0;

  function handleDragEnd() {
    if (x.get() < ARCHIVE_THRESHOLD) {
      animate(x, -300, { duration: ARCHIVE_ANIM_DURATION, ease: EASING });
      setTimeout(() => onArchive(task.id), ARCHIVE_ANIM_DURATION * 1000 * 0.8);
    } else {
      animate(x, 0, { duration: 0.3, ease: EASING });
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Archive reveal layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-4"
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

      {/* Row */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.1}
        style={{ x, opacity: isDone ? 0.45 : 1 }}
        onDragEnd={handleDragEnd}
        className="relative flex items-center gap-3 min-h-11 py-2.5"
      >
        <Checkbox
          checked={isDone}
          onChange={() => !isDone && onComplete(task.id)}
          disabled={isDone}
        />

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span
              className="font-body text-sm leading-snug truncate"
              style={{
                color:
                  zombieAge !== null
                    ? "var(--color-zombie-text)"
                    : "var(--color-text-primary)",
                textDecoration: isDone ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>
            {zombieAge !== null && <ZombieBadge daysOld={zombieAge} />}
            {!isDone && opportunityCostCount > 0 && score && (
              <OpportunityCostBadge
                count={opportunityCostCount}
                reasoning={score.reasoning}
                areaColor={areaColor}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.goal && (
              <span
                className="font-body text-xs truncate"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {task.goal.title}
              </span>
            )}
            {!isDone && score && (
              <ImpactBar score={Number(score.impactScore)} color={areaColor} />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
