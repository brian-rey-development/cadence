import { requireAuth } from "@/modules/auth/utils";
import AppShell from "@/shared/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return <AppShell>{children}</AppShell>;
}
