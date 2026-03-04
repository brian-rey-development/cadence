"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { today } from "@/shared/utils/date";
import type { HabitWithLogs } from "../habits.types";
import { logHabit } from "../mutations/log-habit";
import { unlogHabit } from "../mutations/unlog-habit";
import { HABITS_QUERY_KEY } from "./use-habits";

type LogHabitArgs = { habitId: string; isLogged: boolean };

export function useLogHabit(date: string = today()) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ habitId, isLogged }: LogHabitArgs) =>
      isLogged ? unlogHabit(habitId, date) : logHabit(habitId, date),

    onMutate: async ({ habitId, isLogged }) => {
      await queryClient.cancelQueries({ queryKey: HABITS_QUERY_KEY });
      const previous =
        queryClient.getQueryData<HabitWithLogs[]>(HABITS_QUERY_KEY);

      queryClient.setQueryData<HabitWithLogs[]>(HABITS_QUERY_KEY, (prev = []) =>
        prev.map((habit) => {
          if (habit.id !== habitId) return habit;
          const logs = isLogged
            ? habit.logs.filter((l) => l.date !== date)
            : [
                ...habit.logs,
                {
                  id: crypto.randomUUID(),
                  habitId,
                  userId: habit.userId,
                  date,
                  createdAt: new Date(),
                },
              ];
          return { ...habit, logs };
        }),
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(HABITS_QUERY_KEY, ctx.previous);
    },

    onSettled: () => router.refresh(),
  });
}
