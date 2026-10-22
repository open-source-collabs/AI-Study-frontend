"use client";

import { useCallback, useEffect, useState } from "react";
import { checkpointRepository, type Checkpoint, type CheckpointMode } from "@/core/storage";

// A checkpoint write must never get in the way of studying, so storage errors are swallowed here.
const ignore = () => undefined;

// Where the student was in this mode of this set. `isLoaded` flips once the saved position has been read.
export function useCheckpoint(setId: string, mode: CheckpointMode) {
  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    checkpointRepository.get(setId, mode).then((saved) => {
      if (active) setCheckpoint(saved ?? null);
    }).catch(ignore).finally(() => {
      if (active) setIsLoaded(true);
    });
    return () => { active = false; };
  }, [setId, mode]);

  const save = useCallback((position: number, score?: number) => {
    void checkpointRepository.save({ setId, mode, position, score }).catch(ignore);
  }, [setId, mode]);

  const clear = useCallback(() => {
    void checkpointRepository.clear(setId, mode).catch(ignore);
  }, [setId, mode]);

  return { checkpoint, clear, isLoaded, save };
}

// For modes with no position (summary, ask): opening the page is the checkpoint, so "Continue" lands back here.
export function useVisitCheckpoint(setId: string, mode: CheckpointMode) {
  useEffect(() => {
    void checkpointRepository.save({ setId, mode, position: 0 }).catch(ignore);
  }, [setId, mode]);
}
