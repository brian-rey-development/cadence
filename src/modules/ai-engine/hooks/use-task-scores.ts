"use client";

import { useQuery } from "@tanstack/react-query";
import type { AiTaskScore } from "../ai-engine.types";

export function useTaskScores(date: string, initialData: AiTaskScore[]) {
  return useQuery({
    queryKey: ["ai-engine", "scores", date],
    queryFn: () => Promise.resolve(initialData),
    initialData,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useTaskScoreMap(
  date: string,
  initialData: AiTaskScore[],
): Record<string, AiTaskScore> {
  const { data } = useTaskScores(date, initialData);
  return Object.fromEntries((data ?? []).map((s) => [s.taskId, s]));
}
