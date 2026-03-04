"use client";

import { useQuery } from "@tanstack/react-query";
import type { TaskWithGoal } from "../queries/get-tasks-for-day";

export function useTasksForDay(date: string, initialData: TaskWithGoal[]) {
  return useQuery({
    queryKey: ["tasks", "today", date],
    queryFn: () => Promise.resolve(initialData),
    initialData,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
