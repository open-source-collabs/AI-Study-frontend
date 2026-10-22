"use client";

import { liveQuery } from "dexie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/core/components/Card";
import { useStoredStudySets } from "@/core/hooks/use-stored-study-sets";
import { checkpointRepository, type Checkpoint } from "@/core/storage";

function describe({ mode, position }: Checkpoint) {
  if (mode === "flashcards") return `Flashcards · card ${position + 1}`;
  if (mode === "quiz") return `Quiz · question ${position + 1}`;
  return mode === "ask" ? "Ask your material" : "Summary";
}

// The last place the student was, across all study sets. Renders nothing until there is something to continue.
export function ContinueCard() {
  const { studySets } = useStoredStudySets();
  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null);

  useEffect(() => {
    const subscription = liveQuery(() => checkpointRepository.latest()).subscribe({
      next: (latest) => setCheckpoint(latest ?? null),
      error: () => setCheckpoint(null),
    });
    return () => subscription.unsubscribe();
  }, []);

  const studySet = studySets.find((candidate) => candidate.id === checkpoint?.setId);
  if (!checkpoint || !studySet) return null;

  return <Card className="continue-card">
    <div><span className="eyebrow">Pick up where you left off</span><h2>{studySet.title}</h2><p className="muted-text">{describe(checkpoint)}</p></div>
    <Link className="button button-primary" href={`/sets/${checkpoint.setId}/${checkpoint.mode}`}>Continue</Link>
  </Card>;
}
