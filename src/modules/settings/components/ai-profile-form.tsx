"use client";

import { useRef, useState } from "react";
import type { UserSettingsModel } from "@/db/schema";
import { upsertAiProfile } from "../mutations/upsert-ai-profile";

type AiProfileFormProps = {
  initialSettings: UserSettingsModel | undefined;
};

type FieldConfig = {
  key: "aiDisplayName" | "aiRole" | "aiAbout" | "aiWorkStyle";
  label: string;
  placeholder: string;
  maxLength: number;
  rows: number;
};

const FIELDS: FieldConfig[] = [
  {
    key: "aiDisplayName",
    label: "Your name",
    placeholder: "Brian",
    maxLength: 30,
    rows: 1,
  },
  {
    key: "aiRole",
    label: "Role / context",
    placeholder: "Indie founder, solo dev building a SaaS product",
    maxLength: 100,
    rows: 2,
  },
  {
    key: "aiAbout",
    label: "About you",
    placeholder: "What you're working toward, your values, your situation...",
    maxLength: 500,
    rows: 4,
  },
  {
    key: "aiWorkStyle",
    label: "Work style",
    placeholder: "Peak hours, energy patterns, how you like to work...",
    maxLength: 300,
    rows: 3,
  },
];

export default function AiProfileForm({ initialSettings }: AiProfileFormProps) {
  const [values, setValues] = useState({
    aiDisplayName: initialSettings?.aiDisplayName ?? "",
    aiRole: initialSettings?.aiRole ?? "",
    aiAbout: initialSettings?.aiAbout ?? "",
    aiWorkStyle: initialSettings?.aiWorkStyle ?? "",
  });
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(key: FieldConfig["key"], value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleBlur(key: FieldConfig["key"]) {
    await upsertAiProfile({
      aiDisplayName: values.aiDisplayName || null,
      aiRole: values.aiRole || null,
      aiAbout: values.aiAbout || null,
      aiWorkStyle: values.aiWorkStyle || null,
    });

    setSavedKey(key);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => setSavedKey(null), 1500);
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium uppercase tracking-widest font-body text-text-tertiary">
        AI Profile
      </p>
      <p className="mt-1 text-base font-body text-text-tertiary">
        Helps Cadence personalize suggestions to you.
      </p>

      <div className="mt-3 flex flex-col gap-3">
        {FIELDS.map(({ key, label, placeholder, maxLength, rows }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor={key}
                className="text-base font-medium font-body text-text-secondary"
              >
                {label}
              </label>
              {savedKey === key && (
                <span className="text-sm font-body text-text-tertiary">
                  Saved
                </span>
              )}
            </div>
            <textarea
              id={key}
              rows={rows}
              maxLength={maxLength}
              value={values[key]}
              placeholder={placeholder}
              onChange={(e) => handleChange(key, e.target.value)}
              onBlur={() => handleBlur(key)}
              className="w-full resize-none rounded-xl px-4 py-3 font-body text-base outline-none"
              style={{
                backgroundColor: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-subtle)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
