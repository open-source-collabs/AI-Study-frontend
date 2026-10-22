"use client";

import { liveQuery } from "dexie";
import { useEffect, useState } from "react";
import { studySetRepository, type StudySet } from "@/core/storage";

// liveQuery re-runs on every IndexedDB change, so every list on screen updates when a set is added.
export function useStoredStudySets() {
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = liveQuery(() => studySetRepository.list()).subscribe({
      next: (result) => {
        setStudySets(result);
        setError(null);
        setIsLoading(false);
      },
      error: () => {
        setError("Could not open your saved study sets in this browser.");
        setIsLoading(false);
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  return { error, isLoading, studySets };
}
