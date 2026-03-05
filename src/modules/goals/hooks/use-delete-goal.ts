"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteGoal } from "../mutations/delete-goal";
import { GOALS_QUERY_KEY } from "./use-goals";
import type { GoalWithMilestones } from "../goals.types";

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteGoal,
    onMutate: async (goalId: string) => {
      await queryClient.cancelQueries({ queryKey: GOALS_QUERY_KEY });
      const previous = queryClient.getQueryData<GoalWithMilestones[]>(GOALS_QUERY_KEY);

      queryClient.setQueryData<GoalWithMilestones[]>(GOALS_QUERY_KEY, (prev = []) =>
        prev.filter((g) => g.id !== goalId),
      );

      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(GOALS_QUERY_KEY, ctx.previous);
    },
    onSuccess: () => router.refresh(),
  });
}
