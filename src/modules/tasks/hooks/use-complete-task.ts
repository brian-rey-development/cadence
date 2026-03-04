"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { completeTask } from "../mutations/complete-task";
import type { TaskWithGoal } from "../queries/get-tasks-for-day";

export function useCompleteTask(date: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const key = ["tasks", "today", date];

  return useMutation({
    mutationFn: completeTask,
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TaskWithGoal[]>(key);

      queryClient.setQueryData<TaskWithGoal[]>(key, (prev = []) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: "completed" as const, completedAt: new Date() }
            : t,
        ),
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
    },
    onSuccess: () => router.refresh(),
  });
}
