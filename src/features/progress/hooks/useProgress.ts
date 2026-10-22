"use client";

import { liveQuery } from "dexie";
import { useEffect, useMemo, useState } from "react";
import { useStoredStudySets } from "@/core/hooks/use-stored-study-sets";
import { progressRepository, type ProgressEvent } from "@/core/storage";
import { summarizeProgress } from "../api/summarize";

// null until the first read finishes. liveQuery keeps it current as the student studies in other tabs or pages.
export function useProgress() {
  const { studySets } = useStoredStudySets();
  const [events, setEvents] = useState<ProgressEvent[] | null>(null);

  useEffect(() => {
    const subscription = liveQuery(() => progressRepository.all()).subscribe({
      next: setEvents,
      error: () => setEvents([]),
    });
    return () => subscription.unsubscribe();
  }, []);

  return useMemo(() => (events ? summarizeProgress(events, studySets) : null), [events, studySets]);
}
