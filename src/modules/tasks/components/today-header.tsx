import { Settings } from "lucide-react";
import Link from "next/link";
import type { TaskWithGoal } from "../tasks.types";
import DailyLimitBanner from "./daily-limit-banner";
import GreetingText from "./greeting-text";

type TodayHeaderProps = {
  displayName: string;
  date: string;
  tasks: TaskWithGoal[];
  dailyTaskLimit?: number;
};

export default function TodayHeader({
  displayName,
  date,
  tasks,
  dailyTaskLimit,
}: TodayHeaderProps) {
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <header className="flex items-start justify-between">
      <div>
        <GreetingText displayName={displayName} />
        <p className="text-base font-body text-text-tertiary">
          {formattedDate}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <DailyLimitBanner tasks={tasks} dailyTaskLimit={dailyTaskLimit} />
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors duration-150 active:bg-[var(--color-ghost-active)] text-text-tertiary"
        >
          <Settings size={20} strokeWidth={1.5} />
        </Link>
      </div>
    </header>
  );
}
