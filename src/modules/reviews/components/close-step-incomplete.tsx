"use client";

import { useState } from "react";
import type { TaskWithGoal } from "@/modules/tasks/tasks.types";
import { getZombieAge, isZombie } from "@/modules/tasks/utils/zombie";
import ZombieResolutionCard from "./zombie-resolution-card";

type CloseStepIncompleteProps = {
  tasks: TaskWithGoal[];
  onNext: () => void;
  onPostpone: (taskId: string, toDate: string) => void;
  onArchive: (taskId: string) => void;
};

type ReformulateState = {
  taskId: string;
  suggestedTitle: string;
  reasoning: string;
} | null;

export default function CloseStepIncomplete({
  tasks,
  onNext,
  onPostpone,
  onArchive,
}: CloseStepIncompleteProps) {
  const incomplete = [...tasks]
    .filter((t) => t.status === "pending")
    .sort((a, b) => (isZombie(b) ? 1 : 0) - (isZombie(a) ? 1 : 0));

  const [actioned, setActioned] = useState<Set<string>>(new Set());
  const [reformulating, setReformulating] = useState<string | null>(null);
  const [reformulateResult, setReformulateResult] =
    useState<ReformulateState>(null);

  const allActioned = incomplete.every((t) => actioned.has(t.id));

  function markActioned(id: string) {
    setActioned((prev) => new Set([...prev, id]));
  }

  async function handleReformulate(task: TaskWithGoal) {
    setReformulating(task.id);
    try {
      const res = await fetch("/api/ai/zombie-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalTitle: task.title,
          area: task.area,
          daysSinceCreated: getZombieAge(task),
          goals: [],
        }),
      });
      const data = await res.json();
      setReformulateResult({
        taskId: task.id,
        suggestedTitle: data.suggestedTitle,
        reasoning: data.reasoning,
      });
    } finally {
      setReformulating(null);
    }
  }

  function handleConfirmReformulate() {
    if (!reformulateResult) return;
    markActioned(reformulateResult.taskId);
    setReformulateResult(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <p
        className="font-['DM_Sans'] text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {incomplete.length === 0
          ? "No incomplete tasks. Great day!"
          : `${incomplete.length} task${incomplete.length === 1 ? "" : "s"} left`}
      </p>

      {reformulateResult && (
        <div
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{
            backgroundColor: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          <p
            className="font-['DM_Sans'] text-xs"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {reformulateResult.reasoning}
          </p>
          <p
            className="font-['DM_Sans'] text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            {reformulateResult.suggestedTitle}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setReformulateResult(null)}
              className="flex-1 min-h-[36px] rounded-lg font-['DM_Sans'] text-xs"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-secondary)",
              }}
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={handleConfirmReformulate}
              className="flex-1 min-h-[36px] rounded-lg font-['DM_Sans'] text-xs font-medium"
              style={{
                backgroundColor: "var(--color-text-primary)",
                color: "var(--color-bg-base)",
              }}
            >
              Use this
            </button>
          </div>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {incomplete.map((task) => (
          <li key={task.id}>
            <ZombieResolutionCard
              task={task}
              onPostpone={(toDate) => {
                onPostpone(task.id, toDate);
                markActioned(task.id);
              }}
              onArchive={() => {
                onArchive(task.id);
                markActioned(task.id);
              }}
              onReformulate={() => handleReformulate(task)}
            />
            {reformulating === task.id && (
              <p
                className="font-['DM_Sans'] text-xs mt-1 px-1"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Thinking...
              </p>
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onNext}
        disabled={incomplete.length > 0 && !allActioned}
        className="min-h-[44px] w-full rounded-xl font-['DM_Sans'] text-sm font-medium transition-opacity disabled:opacity-40"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
        }}
      >
        {allActioned || incomplete.length === 0 ? "Continue" : "Skip"}
      </button>
    </div>
  );
}
