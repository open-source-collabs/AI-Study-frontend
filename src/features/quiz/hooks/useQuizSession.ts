"use client";

import { useCallback, useEffect } from "react";
import { useCheckpoint } from "@/core/hooks/use-checkpoint";
import { progressRepository } from "@/core/storage";

// Resumes a half-finished quiz at the question and score the student had reached, and records the final score.
export function useQuizSession(setId: string, total: number) {
  const { checkpoint, clear, isLoaded, save } = useCheckpoint(setId, "quiz");
  // The quiz may have changed since the checkpoint was saved, so never point past its end.
  const initialIndex = Math.min(checkpoint?.position ?? 0, total - 1);
  const initialScore = checkpoint?.score ?? 0;

  // Opening the quiz makes it the latest place to continue from, even before an answer is given.
  useEffect(() => {
    if (isLoaded) save(initialIndex, initialScore);
  }, [isLoaded, initialIndex, initialScore, save]);

  const finish = useCallback((score: number) => {
    void progressRepository.record(setId, { type: "quiz", score, total }).catch(() => undefined);
    clear();
  }, [setId, total, clear]);

  return { finish, initialIndex, initialScore, isReady: isLoaded, saveProgress: save };
}
