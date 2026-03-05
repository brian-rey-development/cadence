"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createTask } from "../mutations/create-task";
import type { TaskWithGoal } from "../tasks.types";

const TEMP_ID_PREFIX = "optimistic-";

export function useCreateTask(date: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const key = ["tasks", "today", date];

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TaskWithGoal[]>(key);

      const optimistic: TaskWithGoal = {
        id: `${TEMP_ID_PREFIX}${Date.now()}`,
        userId: "",
        title: newTask.title,
        area: newTask.area,
        type: newTask.type ?? "daily",
        date: newTask.date ?? null,
        weekStart: newTask.weekStart ?? null,
        status: "pending",
        goalId: newTask.goalId ?? null,
        milestoneId: newTask.milestoneId ?? null,
        scheduledTime: newTask.scheduledTime ?? null,
        postponeCount: 0,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        goal: null,
        milestone: null,
      };

      queryClient.setQueryData<TaskWithGoal[]>(key, (prev = []) => [
        ...prev,
        optimistic,
      ]);

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
    },
    onSuccess: () => router.refresh(),
  });
}
