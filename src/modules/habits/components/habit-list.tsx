"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS, type Area } from "@/shared/config/constants";
import { today } from "@/shared/utils/date";
import type { HabitWithLogs, HabitWithStats } from "../habits.types";
import { useHabits } from "../hooks/use-habits";
import { useDeleteHabit } from "../hooks/use-delete-habit";
import { useLogHabit } from "../hooks/use-log-habit";
import { enrichHabit, sortByLogStatus } from "../utils/enrich";
import CreateHabitSheet from "./create-habit-sheet";
import HabitCard from "./habit-card";

type HabitListProps = {
  initialData: HabitWithLogs[];
};

export default function HabitList({ initialData }: HabitListProps) {
  const { data: habits } = useHabits(initialData);
  const { mutate: toggleLog, isPending } = useLogHabit();
  const { mutate: deleteHabit } = useDeleteHabit();
  const [sheetOpen, setSheetOpen] = useState(false);
  const todayStr = today();

  const enriched = useMemo(() => habits.map(enrichHabit), [habits]);
  const completedToday = enriched.filter((h) =>
    h.logs.some((l) => l.date === todayStr),
  ).length;
  const byArea = useMemo(
    () =>
      AREAS.reduce<Record<Area, HabitWithStats[]>>(
        (acc, area) => {
          acc[area] = sortByLogStatus(
            enriched.filter((h) => h.area === area),
            todayStr,
          );
          return acc;
        },
        { work: [], personal: [], identity: [] },
      ),
    [enriched, todayStr],
  );

  const hasAny = enriched.length > 0;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-body text-text-secondary">
              {enriched.length} {enriched.length === 1 ? "habit" : "habits"}
            </span>
            {enriched.length > 0 && (
              <span className="text-sm font-mono text-text-tertiary">
                {completedToday} of {enriched.length} done today
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-150 bg-bg-surface"
            aria-label="Add habit"
          >
            <Plus size={18} strokeWidth={1.5} className="text-text-primary" />
          </button>
        </div>

        {!hasAny && (
          <div className="flex flex-col items-center gap-3 py-16">
            <span className="text-base font-body text-text-secondary">
              No habits yet
            </span>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="text-base font-medium font-body text-text-primary"
            >
              Add your first habit
            </button>
          </div>
        )}

        {AREAS.map((area) => {
          const areaHabits = byArea[area];
          if (areaHabits.length === 0) return null;

          return (
            <div key={area} className="flex flex-col">
              <span
                className="text-2xs font-semibold font-body uppercase tracking-label mb-1"
                style={{ color: AREA_CONFIG[area].accent }}
              >
                {AREA_CONFIG[area].label}
              </span>
              {areaHabits.map((habit, i) => {
                const isLoggedToday = habit.logs.some(
                  (l) => l.date === todayStr,
                );
                return (
                  <div
                    key={habit.id}
                    className={`transition-opacity duration-normal ease-default ${isLoggedToday ? "opacity-50" : "opacity-100"} ${i > 0 ? "border-t border-border-subtle" : ""}`}
                  >
                    <HabitCard
                      habit={habit}
                      onToggle={(id, logged) =>
                        toggleLog({ habitId: id, isLogged: logged })
                      }
                      onDelete={deleteHabit}
                      isPending={isPending}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <CreateHabitSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
