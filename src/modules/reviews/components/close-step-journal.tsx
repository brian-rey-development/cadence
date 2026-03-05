"use client";

type JournalState = {
  reflection: string;
  gratitude: string;
  challenges: string;
  learnings: string;
};

type CloseStepJournalProps = {
  values: JournalState;
  onChange: (values: JournalState) => void;
  onNext: () => void;
};

type FieldConfig = {
  key: keyof JournalState;
  label: string;
  placeholder: string;
};

const FIELDS: FieldConfig[] = [
  {
    key: "reflection",
    label: "Reflection",
    placeholder: "What went well? What got in the way?",
  },
  {
    key: "gratitude",
    label: "Gratitude",
    placeholder: "What are you grateful for today?",
  },
  {
    key: "challenges",
    label: "Challenges",
    placeholder: "What was hard or blocked you?",
  },
  {
    key: "learnings",
    label: "What did you learn?",
    placeholder: "Any insight, realization, or pattern you noticed...",
  },
];

export default function CloseStepJournal({
  values,
  onChange,
  onNext,
}: CloseStepJournalProps) {
  function handleChange(key: keyof JournalState, value: string) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="flex flex-col gap-4">
      {FIELDS.map(({ key, label, placeholder }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label
            htmlFor={key}
            className="text-sm font-medium font-body uppercase tracking-widest text-text-tertiary"
          >
            {label}
          </label>
          <textarea
            id={key}
            rows={3}
            value={values[key]}
            placeholder={placeholder}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full resize-none rounded-xl px-4 py-3 font-body text-base outline-none"
            style={{
              backgroundColor: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={onNext}
        className="min-h-11 w-full rounded-xl font-body text-base font-medium transition-opacity active:opacity-70"
        style={{
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-bg-base)",
        }}
      >
        Continue
      </button>
    </div>
  );
}
