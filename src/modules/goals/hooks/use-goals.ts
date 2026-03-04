"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { GoalWithTasks } from "../goals.types";

export const GOALS_QUERY_KEY = ["goals", "quarter"] as const;

export function useGoals(initialData: GoalWithTasks[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(GOALS_QUERY_KEY, initialData);
  }, [queryClient, initialData]);

  return useQuery({
    queryKey: GOALS_QUERY_KEY,
    queryFn: () => Promise.resolve(initialData),
    initialData,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
