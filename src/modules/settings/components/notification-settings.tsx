"use client";

import { CLOSE_DAY_AFTER_HOUR } from "@/shared/config/constants";
import { useSaveSettings, useUserSettings } from "../hooks/use-user-settings";
import type { UserSettings } from "../settings.types";

type NotificationSettingsProps = {
  initialSettings: UserSettings | undefined;
};

type SettingsSnapshot = {
  morningEnabled: boolean;
  eveningEnabled: boolean;
  morningNotificationTime: string | null;
  eveningNotificationTime: string | null;
  timezone: string;
  closeDayAfterHour: number;
};

function toSnapshot(
  settings: UserSettings | null | undefined,
): SettingsSnapshot {
  return {
    morningEnabled: settings?.morningEnabled ?? false,
    eveningEnabled: settings?.eveningEnabled ?? false,
    morningNotificationTime: settings?.morningNotificationTime ?? null,
    eveningNotificationTime: settings?.eveningNotificationTime ?? null,
    timezone:
      settings?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    closeDayAfterHour: settings?.closeDayAfterHour ?? CLOSE_DAY_AFTER_HOUR,
  };
}

function hourToTimeValue(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function timeValueToHour(time: string): number {
  return Number(time.split(":")[0]);
}

export default function NotificationSettings({
  initialSettings,
}: NotificationSettingsProps) {
  const { data: settings } = useUserSettings(initialSettings);
  const { mutate: saveSettings } = useSaveSettings();

  const snapshot = toSnapshot(settings);

  function handleChange(patch: Partial<SettingsSnapshot>) {
    saveSettings({ ...snapshot, ...patch });
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="font-[family-name:var(--font-body)] text-sm font-medium uppercase tracking-widest text-text-tertiary">
        Notifications
      </p>

      <div className="mt-2 flex flex-col gap-px overflow-hidden rounded-2xl bg-[var(--color-bg-elevated)]">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <span className="font-[family-name:var(--font-body)] text-base text-text-primary">
            Morning reminder
          </span>
          <div className="flex items-center gap-3">
            {snapshot.morningEnabled && (
              <input
                type="time"
                aria-label="Morning notification time"
                value={snapshot.morningNotificationTime ?? "08:00"}
                onChange={(e) =>
                  handleChange({ morningNotificationTime: e.target.value })
                }
                className="rounded-lg bg-[var(--color-bg-base)] px-2 py-1 font-mono text-base text-text-secondary outline-none"
              />
            )}
            <button
              type="button"
              role="switch"
              aria-checked={snapshot.morningEnabled}
              aria-label="Toggle morning reminder"
              onClick={() =>
                handleChange({ morningEnabled: !snapshot.morningEnabled })
              }
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                snapshot.morningEnabled
                  ? "bg-[var(--color-work-accent)]"
                  : "bg-[var(--color-border-default)]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  snapshot.morningEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <span className="font-[family-name:var(--font-body)] text-base text-text-primary">
            Close day after
          </span>
          <input
            type="time"
            aria-label="Close day after hour"
            value={hourToTimeValue(snapshot.closeDayAfterHour)}
            onChange={(e) =>
              handleChange({
                closeDayAfterHour: timeValueToHour(e.target.value),
              })
            }
            className="rounded-lg bg-[var(--color-bg-base)] px-2 py-1 font-mono text-base text-text-secondary outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <span className="font-[family-name:var(--font-body)] text-base text-text-primary">
            Evening reminder
          </span>
          <div className="flex items-center gap-3">
            {snapshot.eveningEnabled && (
              <input
                type="time"
                aria-label="Evening notification time"
                value={snapshot.eveningNotificationTime ?? "20:00"}
                onChange={(e) =>
                  handleChange({ eveningNotificationTime: e.target.value })
                }
                className="rounded-lg bg-[var(--color-bg-base)] px-2 py-1 font-mono text-base text-text-secondary outline-none"
              />
            )}
            <button
              type="button"
              role="switch"
              aria-checked={snapshot.eveningEnabled}
              aria-label="Toggle evening reminder"
              onClick={() =>
                handleChange({ eveningEnabled: !snapshot.eveningEnabled })
              }
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                snapshot.eveningEnabled
                  ? "bg-[var(--color-work-accent)]"
                  : "bg-[var(--color-border-default)]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  snapshot.eveningEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
