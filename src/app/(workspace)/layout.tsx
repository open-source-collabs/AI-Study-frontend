import { AppShell } from "@/core/components/AppShell";

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
