"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createHabit } from "../mutations/create-habit";
import { HABITS_QUERY_KEY } from "./use-habits";

export function useCreateHabit() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
      router.refresh();
    },
  });
}
