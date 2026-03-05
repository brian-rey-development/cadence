"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createMilestone } from "../mutations/create-milestone";
import { deleteMilestone } from "../mutations/delete-milestone";
import { updateMilestone } from "../mutations/update-milestone";

export function milestonesQueryKey(goalId: string) {
  return ["milestones", goalId] as const;
}

export function useCreateMilestone(goalId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestonesQueryKey(goalId) });
      queryClient.invalidateQueries({ queryKey: ["goals", "quarter"] });
      router.refresh();
    },
  });
}

export function useUpdateMilestone(goalId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestonesQueryKey(goalId) });
      queryClient.invalidateQueries({ queryKey: ["goals", "quarter"] });
      router.refresh();
    },
  });
}

export function useDeleteMilestone(goalId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestonesQueryKey(goalId) });
      queryClient.invalidateQueries({ queryKey: ["goals", "quarter"] });
      router.refresh();
    },
  });
}
