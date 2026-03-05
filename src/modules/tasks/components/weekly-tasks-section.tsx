"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { completeTask } from "@/modules/tasks/mutations/complete-task";
import type { TaskWithGoal } from "../tasks.types";
import WeeklyTaskItem from "./weekly-task-item";

type WeeklyTasksSectionProps = {
  initialTasks: TaskWithGoal[];
  weekStart: string;
};

export default function WeeklyTasksSection({
  initialTasks,
  weekStart,
}: WeeklyTasksSectionProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const key = ["tasks", "weekly", weekStart];

  const { data: tasks = initialTasks } = useQuery<TaskWithGoal[]>({
    queryKey: key,
    initialData: initialTasks,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const { mutate: toggle } = useMutation({
    mutationFn: async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      if (task.status === "pending") {
        await completeTask(taskId);
      }
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<TaskWithGoal[]>(key);
      queryClient.setQueryData<TaskWithGoal[]>(key, (old = []) =>
        old.map((t) =>
          t.id === taskId
            ? { ...t, status: t.status === "pending" ? "completed" : "pending" }
            : t,
        ),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
    },
    onSuccess: () => router.refresh(),
  });

  if (tasks.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium font-body uppercase tracking-widest text-text-tertiary">
        This week
      </span>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <WeeklyTaskItem key={task.id} task={task} onToggle={toggle} />
        ))}
      </div>
    </div>
  );
}
