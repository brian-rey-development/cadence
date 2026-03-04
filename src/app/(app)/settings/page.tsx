import { requireAuth } from "@/modules/auth/utils";
import NotificationSettings from "@/modules/settings/components/notification-settings";
import { getUserSettings } from "@/modules/settings/queries/get-user-settings";

export default async function SettingsPage() {
  const session = await requireAuth();
  const settings = await getUserSettings(session.id);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <header>
        <h1 className="font-['Fraunces'] text-xl text-[var(--color-text-primary)]">
          Settings
        </h1>
      </header>

      <NotificationSettings initialSettings={settings} />
    </div>
  );
}
