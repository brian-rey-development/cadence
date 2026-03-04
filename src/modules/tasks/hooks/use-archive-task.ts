"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { archiveTask } from "../mutations/archive-task";
import type { TaskWithGoal } from "../queries/get-tasks-for-day";

export function useArchiveTask(date: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const key = ["tasks", "today", date];

  return useMutation({
    mutationFn: archiveTask,
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TaskWithGoal[]>(key);

      queryClient.setQueryData<TaskWithGoal[]>(key, (prev = []) =>
        prev.filter((t) => t.id !== taskId),
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
    },
    onSuccess: () => router.refresh(),
  });
}
