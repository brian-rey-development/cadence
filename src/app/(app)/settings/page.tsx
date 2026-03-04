import { signOut } from "@/modules/auth/mutations/sign-out";
import { requireAuth } from "@/modules/auth/utils";
import AiProfileForm from "@/modules/settings/components/ai-profile-form";
import NotificationSettings from "@/modules/settings/components/notification-settings";
import { getUserSettings } from "@/modules/settings/queries/get-user-settings";

export default async function SettingsPage() {
  const user = await requireAuth();
  const settings = await getUserSettings(user.id);
  const initial = user.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex flex-col gap-8 px-4 py-6 max-w-lg mx-auto">
      <header>
        <h1 className="font-display text-2xl text-text-primary">Settings</h1>
      </header>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-widest font-body text-text-tertiary">
          Account
        </p>
        <div className="mt-2 overflow-hidden rounded-2xl bg-[var(--color-bg-elevated)]">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-bg-surface)" }}
            >
              <span className="text-sm font-medium font-body text-text-secondary">
                {initial}
              </span>
            </div>
            <span className="text-sm font-body text-text-secondary">
              {user.email}
            </span>
          </div>
          <div style={{ borderTop: "1px solid var(--color-border-subtle)" }} />
          <form action={signOut}>
            <button
              type="submit"
              className="w-full px-4 py-3.5 text-left text-sm font-body transition-opacity active:opacity-70"
              style={{ color: "var(--color-destructive-text)" }}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <NotificationSettings initialSettings={settings} />

      <AiProfileForm initialSettings={settings} />
    </div>
  );
}
