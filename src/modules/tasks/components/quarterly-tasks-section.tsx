"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { completeTask } from "@/modules/tasks/mutations/complete-task";
import type { TaskWithGoal } from "../tasks.types";

type QuarterlyTasksSectionProps = {
  initialTasks: TaskWithGoal[];
};

function TaskRow({
  task,
  onToggle,
}: {
  task: TaskWithGoal;
  onToggle: (id: string) => void;
}) {
  const isDone = task.status === "completed";

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl bg-bg-elevated"
    >
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        className="mt-0.5 shrink-0 h-4 w-4 rounded flex items-center justify-center transition-colors duration-150"
        style={{
          backgroundColor: isDone ? "var(--color-text-primary)" : "transparent",
          border: "1.5px solid var(--color-border-default)",
        }}
        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
      >
        {isDone && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="var(--color-bg-base)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span
          className="text-sm font-body leading-snug"
          style={{
            color: isDone
              ? "var(--color-text-tertiary)"
              : "var(--color-text-primary)",
            textDecoration: isDone ? "line-through" : "none",
          }}
        >
          {task.title}
        </span>
        {task.goal && (
          <span
            className="text-xs font-body truncate text-text-tertiary"
          >
            {task.goal.title}
          </span>
        )}
      </div>
    </div>
  );
}

export default function QuarterlyTasksSection({
  initialTasks,
}: QuarterlyTasksSectionProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const key = ["tasks", "quarterly"];

  const { data: tasks = initialTasks } = useQuery<TaskWithGoal[]>({
    queryKey: key,
    initialData: initialTasks,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const { mutate: toggle } = useMutation({
    mutationFn: async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task?.status === "pending") await completeTask(taskId);
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<TaskWithGoal[]>(key);
      queryClient.setQueryData<TaskWithGoal[]>(key, (old = []) =>
        old.map((t) =>
          t.id === taskId
            ? { ...t, status: t.status === "pending" ? "completed" : "pending" }
            : t,
        ),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
    },
    onSuccess: () => router.refresh(),
  });

  if (tasks.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-xs font-medium font-body uppercase tracking-widest text-text-tertiary"
      >
        Milestones
      </span>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onToggle={toggle} />
        ))}
      </div>
    </div>
  );
}
