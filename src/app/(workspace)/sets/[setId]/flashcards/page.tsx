import { Suspense } from "react";
import { FlashcardDeck } from "@/features/flashcards";

export default function FlashcardsPage({ params }: { params: Promise<{ setId: string }> }) {
  return <div className="page-stack">
    <header className="page-heading"><span className="eyebrow">Practice</span><h1>Flashcards</h1><p>Practice active recall with a focused deck linked to your source material.</p></header>
    <Suspense fallback={<div className="loading-state">Loading...</div>}>{params.then(({ setId }) => <FlashcardDeck setId={setId} />)}</Suspense>
  </div>;
}
