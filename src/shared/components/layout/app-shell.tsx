import BottomNav from "./bottom-nav";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative flex min-h-svh flex-col bg-[var(--color-bg-base)]">
      <main className="flex-1 overflow-y-auto pb-[64px]">{children}</main>
      <BottomNav />
    </div>
  );
}
