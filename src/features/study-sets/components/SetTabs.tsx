import { ActiveLink } from "@/core/components/ActiveLink";

const tabs = [
  { slug: "summary", label: "Summary" },
  { slug: "flashcards", label: "Flashcards" },
  { slug: "quiz", label: "Quiz" },
  { slug: "ask", label: "Ask" },
];

export function SetTabs({ setId }: { setId: string }) {
  return <nav aria-label="Study modes" className="set-tabs">
    {tabs.map((tab) => <ActiveLink activeClassName="set-tab-active" className="set-tab" href={`/sets/${setId}/${tab.slug}`} key={tab.slug}>{tab.label}</ActiveLink>)}
  </nav>;
}
