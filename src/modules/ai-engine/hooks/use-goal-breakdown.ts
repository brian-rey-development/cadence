"use client";

import { useQuery } from "@tanstack/react-query";
import type { AiGoalBreakdown } from "../ai-engine.types";

async function fetchBreakdown(goalId: string): Promise<AiGoalBreakdown | null> {
  const res = await fetch(`/api/ai/engine/goal-breakdown?goalId=${goalId}`);
  if (!res.ok) return null;
  return res.json();
}

export function useGoalBreakdown(_userId: string, goalId: string) {
  return useQuery<AiGoalBreakdown | null>({
    queryKey: ["ai-engine", "breakdown", goalId],
    queryFn: () => fetchBreakdown(goalId),
    staleTime: Number.POSITIVE_INFINITY,
    refetchInterval: (query) => (query.state.data ? false : 8000),
    refetchOnWindowFocus: false,
  });
}
