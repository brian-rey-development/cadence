"use client";

import { useMutation } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MilestoneModel, TaskModel } from "@/db/schema";
import {
  useCreateMilestone,
  useDeleteMilestone,
  useUpdateMilestone,
} from "@/modules/milestones/hooks/use-milestones";
import { createTask } from "@/modules/tasks/mutations/create-task";

type GoalMilestonesProps = {
  milestones: MilestoneModel[];
  goalTasks: TaskModel[];
  goalId: string;
  area: "work" | "personal" | "identity";
  accentColor: string;
};

export default function GoalMilestones({
  milestones,
  goalTasks,
  goalId,
  area,
  accentColor,
}: GoalMilestonesProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const editInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createM, isPending: isCreating } = useCreateMilestone(goalId);
  const { mutate: updateM, isPending: isUpdating } = useUpdateMilestone(goalId);
  const { mutate: deleteM, isPending: isDeleting } = useDeleteMilestone(goalId);

  const router = useRouter();
  const { mutate: addTask, isPending: isAddingTask } = useMutation({
    mutationFn: createTask,
    onSuccess: () => router.refresh(),
  });

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    if (isAdding) addInputRef.current?.focus();
  }, [isAdding]);

  function startEdit(m: MilestoneModel) {
    setEditingId(m.id);
    setEditTitle(m.title);
  }

  function saveEdit(m: MilestoneModel) {
    if (!editTitle.trim() || editTitle.trim() === m.title) {
      setEditingId(null);
      return;
    }
    updateM(
      { id: m.id, title: editTitle.trim() },
      { onSuccess: () => setEditingId(null) },
    );
  }

  function handleAdd() {
    if (!newTitle.trim() || !newDate) return;
    createM(
      { goalId, title: newTitle.trim(), targetDate: newDate },
      {
        onSuccess: () => {
          setNewTitle("");
          setNewDate("");
          setIsAdding(false);
        },
      },
    );
  }

  function handleAddTask(milestoneId: string, targetDate: string) {
    addTask({
      userId: "",
      title: "New task",
      area,
      type: "daily",
      date: targetDate,
      weekStart: null,
      goalId,
      milestoneId,
      status: "pending",
      postponeCount: 0,
      completedAt: null,
    });
  }

  return (
    <div className="flex flex-col gap-3 pt-2">
      {milestones.map((m) => {
        const linkedTasks = goalTasks.filter((t) => t.milestoneId === m.id);
        const isEditing = editingId === m.id;

        return (
          <div key={m.id} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: accentColor }}
              />

              {isEditing ? (
                <input
                  ref={editInputRef}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => saveEdit(m)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(m);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  disabled={isUpdating}
                  className="flex-1 text-sm font-body bg-transparent outline-none border-b text-text-primary"
                  style={{ borderColor: accentColor }}
                />
              ) : (
                <span className="flex-1 font-body text-sm font-medium leading-snug text-text-primary">
                  {m.title}
                </span>
              )}

              <span className="font-mono text-2xs shrink-0 text-text-tertiary">
                {m.targetDate}
              </span>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(m)}
                  disabled={isUpdating || isDeleting}
                  className="p-1 rounded transition-opacity active:opacity-60 disabled:opacity-30"
                  aria-label="Edit milestone"
                >
                  <Pencil
                    size={11}
                    strokeWidth={1.5}
                    className="text-text-tertiary"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => deleteM(m.id)}
                  disabled={isDeleting || isUpdating}
                  className="p-1 rounded transition-opacity active:opacity-60 disabled:opacity-30"
                  aria-label="Delete milestone"
                >
                  <Trash2
                    size={11}
                    strokeWidth={1.5}
                    className="text-text-tertiary"
                  />
                </button>
              </div>
            </div>

            <div className="ml-4 flex items-center justify-between">
              <span className="font-body text-2xs text-text-tertiary">
                {linkedTasks.length} task{linkedTasks.length !== 1 ? "s" : ""}
              </span>
              <button
                type="button"
                disabled={isAddingTask}
                onClick={() => handleAddTask(m.id, m.targetDate)}
                className="flex items-center gap-1 disabled:opacity-50 transition-opacity"
                aria-label="Add task to milestone"
              >
                <Plus
                  size={11}
                  strokeWidth={1.5}
                  style={{ color: accentColor }}
                />
                <span
                  className="font-body text-2xs"
                  style={{ color: accentColor }}
                >
                  Add task
                </span>
              </button>
            </div>
          </div>
        );
      })}

      {isAdding ? (
        <div className="flex flex-col gap-2 mt-1">
          <input
            ref={addInputRef}
            placeholder="Milestone title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="text-sm font-body bg-transparent outline-none border-b pb-1 text-text-primary"
            style={{ borderColor: "var(--color-border-subtle)" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setIsAdding(false);
            }}
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="text-xs font-mono bg-transparent outline-none text-text-tertiary"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newTitle.trim() || !newDate || isCreating}
              className="text-xs font-medium font-body px-3 py-1.5 rounded-md disabled:opacity-50"
              style={{
                backgroundColor: accentColor,
                color: "var(--color-bg-base)",
              }}
            >
              {isCreating ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs font-body text-text-tertiary px-3 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 mt-1 w-fit transition-opacity active:opacity-70"
        >
          <Plus size={12} strokeWidth={1.5} style={{ color: accentColor }} />
          <span className="font-body text-xs" style={{ color: accentColor }}>
            Add milestone
          </span>
        </button>
      )}
    </div>
  );
}
