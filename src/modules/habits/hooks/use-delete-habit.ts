"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteHabit } from "../mutations/delete-habit";
import type { HabitWithLogs } from "../habits.types";
import { HABITS_QUERY_KEY } from "./use-habits";

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteHabit,
    onMutate: async (habitId: string) => {
      await queryClient.cancelQueries({ queryKey: HABITS_QUERY_KEY });
      const previous = queryClient.getQueryData<HabitWithLogs[]>(HABITS_QUERY_KEY);

      queryClient.setQueryData<HabitWithLogs[]>(HABITS_QUERY_KEY, (prev = []) =>
        prev.filter((h) => h.id !== habitId),
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(HABITS_QUERY_KEY, ctx.previous);
    },
    onSuccess: () => router.refresh(),
  });
}
