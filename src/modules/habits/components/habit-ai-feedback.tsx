"use client";

import { Lightbulb, Zap, User } from "lucide-react";
import Button from "@/shared/components/ui/button";
import { AREA_CONFIG } from "@/shared/config/areas";
import type { Area } from "@/shared/config/constants";
import type { HabitFeedback } from "@/modules/ai/prompts/refine-habit";

type HabitAiFeedbackProps = {
  feedback: HabitFeedback;
  area: Area;
  onSave: () => void;
  onBack: () => void;
  isSaving: boolean;
};

type FeedbackCardProps = {
  icon: React.ReactNode;
  label: string;
  text: string;
  accentColor: string;
};

function FeedbackCard({ icon, label, text, accentColor }: FeedbackCardProps) {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-[10px] px-3.5 py-3"
      style={{ backgroundColor: "var(--color-bg-elevated)" }}
    >
      <div className="flex items-center gap-1.5">
        <span style={{ color: accentColor }}>{icon}</span>
        <span
          className="text-[11px] font-medium font-['DM_Sans'] uppercase tracking-wide"
          style={{ color: accentColor }}
        >
          {label}
        </span>
      </div>
      <p
        className="text-[13px] font-['DM_Sans'] leading-relaxed"
        style={{ color: "var(--color-text-primary)" }}
      >
        {text}
      </p>
    </div>
  );
}

export default function HabitAiFeedback({
  feedback,
  area,
  onSave,
  onBack,
  isSaving,
}: HabitAiFeedbackProps) {
  const config = AREA_CONFIG[area];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <FeedbackCard
          icon={<Lightbulb size={13} strokeWidth={1.5} />}
          label="Insight"
          text={feedback.insight}
          accentColor={config.text}
        />
        <FeedbackCard
          icon={<Zap size={13} strokeWidth={1.5} />}
          label="Trigger"
          text={feedback.trigger}
          accentColor={config.text}
        />
        <FeedbackCard
          icon={<User size={13} strokeWidth={1.5} />}
          label="Identity"
          text={feedback.identityStatement}
          accentColor={config.text}
        />
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <Button onClick={onSave} isLoading={isSaving} disabled={isSaving}>
          Save habit
        </Button>
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="h-11 rounded-[10px] text-[14px] font-['DM_Sans'] transition-opacity active:opacity-70 disabled:opacity-40"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
