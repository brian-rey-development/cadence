"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AREA_CONFIG } from "@/shared/config/areas";
import { AREAS, type Area } from "@/shared/config/constants";
import { today } from "@/shared/utils/date";
import type { HabitWithLogs, HabitWithStats } from "../habits.types";
import { useHabits } from "../hooks/use-habits";
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const todayStr = today();

  const enriched = useMemo(() => habits.map(enrichHabit), [habits]);
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
        <div className="flex items-center justify-between">
          <span
            className="text-[13px] font-['DM_Sans']"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {enriched.length} {enriched.length === 1 ? "habit" : "habits"}
          </span>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-150"
            style={{ backgroundColor: "var(--color-bg-surface)" }}
            aria-label="Add habit"
          >
            <Plus
              size={18}
              strokeWidth={1.5}
              style={{ color: "var(--color-text-primary)" }}
            />
          </button>
        </div>

        {!hasAny && (
          <div
            className="flex flex-col items-center gap-3 py-16 rounded-[12px]"
            style={{ backgroundColor: "var(--color-bg-surface)" }}
          >
            <span
              className="text-[15px] font-['DM_Sans']"
              style={{ color: "var(--color-text-secondary)" }}
            >
              No habits yet
            </span>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="text-[13px] font-medium font-['DM_Sans']"
              style={{ color: "var(--color-text-primary)" }}
            >
              Add your first habit
            </button>
          </div>
        )}

        {AREAS.map((area) => {
          const areaHabits = byArea[area];
          if (areaHabits.length === 0) return null;

          return (
            <div key={area} className="flex flex-col gap-3">
              <span
                className="text-[11px] font-medium font-['DM_Sans'] uppercase tracking-widest"
                style={{ color: AREA_CONFIG[area].text }}
              >
                {AREA_CONFIG[area].label}
              </span>
              {areaHabits.map((habit) => {
                const isLoggedToday = habit.logs.some(
                  (l) => l.date === todayStr,
                );
                return (
                  <div
                    key={habit.id}
                    style={{
                      opacity: isLoggedToday ? 0.5 : 1,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <HabitCard
                      habit={habit}
                      onToggle={(id, logged) =>
                        toggleLog({ habitId: id, isLogged: logged })
                      }
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
