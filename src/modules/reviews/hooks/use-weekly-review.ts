"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { saveWeeklyReview } from "../mutations/save-weekly-review";

type SaveInput = {
  weekStart: string;
  wins: string;
  blockers: string;
  intentions: string;
  aiSuggestions: string;
};

export function useWeeklyReview() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (input: SaveInput) => saveWeeklyReview(input),
    onSettled: () => router.refresh(),
  });

  return {
    saveReview: mutation.mutate,
    isSaving: mutation.isPending,
  };
}
