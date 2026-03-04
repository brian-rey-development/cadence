"use client";

import { useQuery } from "@tanstack/react-query";
import type { AiGoalBreakdown } from "../ai-engine.types";
import { getGoalBreakdown } from "../queries/get-goal-breakdown";

export function useGoalBreakdown(userId: string, goalId: string) {
  return useQuery<AiGoalBreakdown | null>({
    queryKey: ["ai-engine", "breakdown", goalId],
    queryFn: () => getGoalBreakdown(userId, goalId),
    staleTime: (query) => (query.state.data ? 1000 * 60 * 60 : 0),
    refetchInterval: (query) => (query.state.data ? false : 8000),
  });
}
