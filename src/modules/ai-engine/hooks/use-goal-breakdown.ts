"use client";

import { useQuery } from "@tanstack/react-query";
import type { AiGoalBreakdown } from "../ai-engine.types";
import { getGoalBreakdown } from "../queries/get-goal-breakdown";

export function useGoalBreakdown(userId: string, goalId: string) {
  return useQuery<AiGoalBreakdown | null>({
    queryKey: ["ai-engine", "breakdown", goalId],
    queryFn: () => getGoalBreakdown(userId, goalId),
    staleTime: 1000 * 60 * 60,
  });
}
