"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { archiveTask } from "@/modules/tasks/mutations/archive-task";
import { postponeTask } from "@/modules/tasks/mutations/postpone-task";
import { saveDailyReview } from "../mutations/save-daily-review";

type PostponeInput = {
  taskId: string;
  toDate: string;
};

type SaveReviewInput = {
  date: string;
  reflection: string;
  gratitude: string;
  challenges: string;
  learnings: string;
  tomorrowFocus: string;
  mood: "great" | "good" | "okay" | "tough";
  aiSummary: string;
  aiFeedback: string;
  aiInsights: string[];
  aiNextDayFocus: string;
};

export function useDailyClose() {
  const router = useRouter();

  const postpone = useMutation({
    mutationFn: (input: PostponeInput) => postponeTask(input),
    onSettled: () => router.refresh(),
  });

  const archive = useMutation({
    mutationFn: (taskId: string) => archiveTask(taskId),
    onSettled: () => router.refresh(),
  });

  const saveReview = useMutation({
    mutationFn: (input: SaveReviewInput) => saveDailyReview(input),
    onSettled: () => router.refresh(),
  });

  return {
    postponeTask: postpone.mutateAsync,
    archiveTask: archive.mutateAsync,
    saveDailyReview: saveReview.mutateAsync,
    isLoading: postpone.isPending || archive.isPending || saveReview.isPending,
  };
}
