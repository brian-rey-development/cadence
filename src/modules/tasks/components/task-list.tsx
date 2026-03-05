"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { AiTaskScore } from "@/modules/ai-engine/ai-engine.types";
import { useTaskScoreMap } from "@/modules/ai-engine/hooks/use-task-scores";
import EmptyState from "@/shared/components/common/empty-state";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS } from "@/shared/config/constants";
import { useDeleteTask } from "../hooks/use-delete-task";
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
  const { mutate: deleteTask } = useDeleteTask(date);
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
    <div className="flex flex-col gap-8">
      {grouped.map(({ area, tasks: areaTasks }) => (
        <section key={area} className="flex flex-col">
          <h2
            className="text-2xs font-body font-semibold uppercase tracking-label mb-2"
            style={{ color: AREA_CONFIG[area].accent }}
          >
            {AREA_CONFIG[area].label}
          </h2>
          {areaTasks.map((task, i) => (
            <div
              key={task.id}
              className={i > 0 ? "border-t border-border-subtle" : undefined}
            >
              <TaskCard
                task={task}
                score={scoreMap[task.id]}
                onComplete={complete}
                onDelete={deleteTask}
              />
            </div>
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
