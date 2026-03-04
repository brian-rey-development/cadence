"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { HabitWithLogs } from "../habits.types";

export const HABITS_QUERY_KEY = ["habits"] as const;

export function useHabits(initialData: HabitWithLogs[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(HABITS_QUERY_KEY, initialData);
  }, [queryClient, initialData]);

  return useQuery({
    queryKey: HABITS_QUERY_KEY,
    queryFn: () => Promise.resolve(initialData),
    initialData,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
