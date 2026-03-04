"use client";

import { useState } from "react";
import DailyCloseSheet from "@/modules/reviews/components/daily-close-sheet";
import CloseDayButton from "@/modules/tasks/components/close-day-button";
import type { TaskWithGoal } from "@/modules/tasks/tasks.types";

type TodayClientProps = {
  tasks: TaskWithGoal[];
  date: string;
  children: React.ReactNode;
};

export default function TodayClient({
  tasks,
  date,
  children,
}: TodayClientProps) {
  const [isCloseOpen, setIsCloseOpen] = useState(false);

  return (
    <>
      {children}
      <div className="fixed bottom-[76px] left-1/2 -translate-x-1/2 z-30">
        <CloseDayButton tasks={tasks} onClick={() => setIsCloseOpen(true)} />
      </div>
      <DailyCloseSheet
        isOpen={isCloseOpen}
        onClose={() => setIsCloseOpen(false)}
        tasks={tasks}
        date={date}
      />
    </>
  );
}
