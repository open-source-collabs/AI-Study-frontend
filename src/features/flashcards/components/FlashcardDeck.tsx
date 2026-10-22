"use client";

import { useState } from "react";
import { Button } from "@/core/components/Button";
import { Chip } from "@/core/components/Chip";
import { OutputStates } from "@/core/components/OutputStates";
import { useFlashcards } from "../hooks/useFlashcards";
import { useFlashcardSession } from "../hooks/useFlashcardSession";
import type { Flashcards } from "../types";

type PlayerProps = Flashcards & {
  initialIndex: number;
  initialMarks: Record<number, boolean>;
  onIndexChange: (index: number) => void;
  onMark: (cardIndex: number, known: boolean) => void;
};

function FlashcardPlayer({ cards, initialIndex, initialMarks, onIndexChange, onMark }: PlayerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [flipped, setFlipped] = useState(false);
  const [marks, setMarks] = useState(initialMarks);
  const card = cards[index];
  const known = Object.values(marks).filter(Boolean).length;
  const toReview = Object.keys(marks).length - known;

  function go(next: number) {
    setIndex(next);
    setFlipped(false);
    onIndexChange(next);
  }

  function mark(isKnown: boolean) {
    setMarks((current) => ({ ...current, [index]: isKnown }));
    onMark(index, isKnown);
    if (index < cards.length - 1) go(index + 1);
  }

  return <div className="flashcard-deck">
    <div className="deck-metrics">
      <Chip>Card {index + 1} / {cards.length}</Chip>
      <Chip className="chip-teal">Known {known}</Chip>
      <Chip>To review {toReview}</Chip>
    </div>
    <button aria-live="polite" className="flashcard" onClick={() => setFlipped(!flipped)} type="button">
      <span className="eyebrow">{flipped ? "Answer" : "Question"}</span>
      <strong>{flipped ? card.back : card.front}</strong>
      <span className="muted-text">{flipped ? "Click to see the question" : "Click to reveal the answer"}</span>
    </button>
    <div className="deck-actions">
      <Button disabled={index === 0} onClick={() => go(index - 1)} variant="ghost">Previous</Button>
      <Button onClick={() => mark(false)} variant="secondary">Still learning</Button>
      <Button onClick={() => mark(true)} variant="teal">I know this</Button>
      <Button disabled={index === cards.length - 1} onClick={() => go(index + 1)} variant="ghost">Next</Button>
    </div>
  </div>;
}

// Mounts the player only after the saved position and marks are read, so it starts exactly where the student left off.
function ResumableDeck({ setId, cards }: { setId: string; cards: Flashcards["cards"] }) {
  const session = useFlashcardSession(setId, cards.length);
  if (!session.isReady) return <div className="loading-state" role="status">Loading...</div>;
  return <FlashcardPlayer cards={cards} initialIndex={session.initialIndex} initialMarks={session.initialMarks} onIndexChange={session.saveIndex} onMark={session.recordMark} />;
}

export function FlashcardDeck({ setId }: { setId: string }) {
  const { data, error, generate, status, canGenerate } = useFlashcards(setId);
  return <OutputStates canGenerate={canGenerate} error={error} label="flashcards" onGenerate={generate} status={status}>
    {data && <ResumableDeck cards={data.cards} setId={setId} />}
  </OutputStates>;
}
