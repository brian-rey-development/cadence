"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createGoal } from "../mutations/create-goal";
import { GOALS_QUERY_KEY } from "./use-goals";

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
      router.refresh();
    },
  });
}
