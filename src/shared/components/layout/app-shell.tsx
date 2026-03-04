type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative flex min-h-svh flex-col bg-[#0E0E0F]">
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>
    </div>
  );
}
