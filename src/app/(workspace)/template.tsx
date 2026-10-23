// A template remounts when the section changes (dashboard, help, a study set), so this replays the fade-in each time.
export default function WorkspaceTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
