import { requireAuth } from "@/modules/auth/utils";
import AppShell from "@/shared/components/layout/app-shell";
import QueryProvider from "@/shared/components/providers/query-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return (
    <QueryProvider>
      <AppShell>{children}</AppShell>
    </QueryProvider>
  );
}
