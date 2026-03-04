"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { AiTaskScore } from "@/modules/ai-engine/ai-engine.types";
import { useTaskScoreMap } from "@/modules/ai-engine/hooks/use-task-scores";
import EmptyState from "@/shared/components/common/empty-state";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS } from "@/shared/config/constants";
import { useArchiveTask } from "../hooks/use-archive-task";
import { useCompleteTask } from "../hooks/use-complete-task";
import { useTasksForDay } from "../hooks/use-tasks-for-day";
import type { TaskWithGoal } from "../queries/get-tasks-for-day";
import TaskCard from "./task-card";

type TaskListProps = {
  initialTasks: TaskWithGoal[];
  initialScores: AiTaskScore[];
  date: string;
};

export default function TaskList({
  initialTasks,
  initialScores,
  date,
}: TaskListProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(["tasks", "today", date], initialTasks);
  }, [initialTasks, date, queryClient]);

  const { data: tasks = [] } = useTasksForDay(date, initialTasks);
  const { mutate: complete } = useCompleteTask(date);
  const { mutate: archive } = useArchiveTask(date);
  const scoreMap = useTaskScoreMap(date, initialScores);

  const grouped = AREAS.map((area) => ({
    area,
    tasks: tasks
      .filter((t) => t.area === area && t.status !== "archived")
      .sort((a, b) => {
        if (a.status === "completed" && b.status !== "completed") return 1;
        if (a.status !== "completed" && b.status === "completed") return -1;
        return a.createdAt
          .toISOString()
          .localeCompare(b.createdAt.toISOString());
      }),
  })).filter((g) => g.tasks.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {grouped.map(({ area, tasks: areaTasks }) => (
        <section key={area} className="flex flex-col gap-2">
          <h2
            className="text-xs font-['DM_Sans'] font-medium uppercase tracking-widest px-1"
            style={{ color: AREA_CONFIG[area].text }}
          >
            {AREA_CONFIG[area].label}
          </h2>
          {areaTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              score={scoreMap[task.id]}
              onComplete={complete}
              onArchive={archive}
            />
          ))}
        </section>
      ))}

      {grouped.length === 0 && (
        <EmptyState
          title="Nothing planned"
          description="Add your first task for today to get started."
        />
      )}
    </div>
  );
}
