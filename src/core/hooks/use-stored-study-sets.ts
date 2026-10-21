"use client";

import { useCallback, useEffect, useState } from "react";
import { studySetRepository, type StudySet } from "@/core/storage";

export function useStoredStudySets() {
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setStudySets(await studySetRepository.list());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    studySetRepository.list().then((result) => {
      if (active) {
        setStudySets(result);
        setIsLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  return { isLoading, refresh, studySets };
}
