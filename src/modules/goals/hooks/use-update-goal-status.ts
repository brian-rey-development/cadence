"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateGoalStatus } from "../mutations/update-goal-status";
import { GOALS_QUERY_KEY } from "./use-goals";

export function useUpdateGoalStatus() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      goalId,
      status,
    }: {
      goalId: string;
      status: "achieved" | "abandoned";
    }) => updateGoalStatus(goalId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      router.refresh();
    },
  });
}
