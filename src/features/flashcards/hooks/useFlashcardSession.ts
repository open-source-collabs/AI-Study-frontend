"use client";

import { useCallback, useEffect, useState } from "react";
import { useCheckpoint } from "@/core/hooks/use-checkpoint";
import { progressRepository } from "@/core/storage";

// Restores where the student was in the deck and which cards they already marked, and saves both as they go.
export function useFlashcardSession(setId: string, total: number) {
  const { checkpoint, isLoaded, save } = useCheckpoint(setId, "flashcards");
  const [savedMarks, setSavedMarks] = useState<Record<number, boolean> | null>(null);

  useEffect(() => {
    let active = true;
    progressRepository.cardMarks(setId).then((marks) => {
      if (active) setSavedMarks(marks);
    }).catch(() => {
      if (active) setSavedMarks({});
    });
    return () => { active = false; };
  }, [setId]);

  const isReady = isLoaded && savedMarks !== null;
  // The deck may have changed since the checkpoint was saved, so never point past its end.
  const initialIndex = Math.min(checkpoint?.position ?? 0, total - 1);

  // Opening the deck makes it the latest place to continue from, even before a card is flipped.
  useEffect(() => {
    if (isReady) save(initialIndex);
  }, [isReady, initialIndex, save]);

  const recordMark = useCallback((cardIndex: number, known: boolean) => {
    void progressRepository.record(setId, { type: "card", cardIndex, known, total }).catch(() => undefined);
  }, [setId, total]);

  const initialMarks = Object.fromEntries(Object.entries(savedMarks ?? {}).filter(([cardIndex]) => Number(cardIndex) < total));
  return { initialIndex, initialMarks, isReady, recordMark, saveIndex: save };
}
