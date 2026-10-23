// Remounts when the tab changes (summary, flashcards, quiz, ask), so only the tab content fades in and the tab bar stays still.
export default function StudySetTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
