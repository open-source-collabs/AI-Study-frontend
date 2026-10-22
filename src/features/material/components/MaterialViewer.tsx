"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Card } from "@/core/components/Card";
import { studySetRepository, type StudySet } from "@/core/storage";

// `children` renders between the heading and the source text, which is where the generated summary goes.
export function MaterialViewer({ setId, children }: { setId: string; children?: ReactNode }) {
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    studySetRepository.get(setId).then((result) => {
      if (active) {
        setStudySet(result ?? null);
        setIsLoading(false);
      }
    }).catch(() => active && setIsLoading(false));
    return () => { active = false; };
  }, [setId]);

  if (isLoading) return <div className="page-stack"><div className="loading-state">Loading study set...</div></div>;
  if (!studySet) return <div className="page-stack"><Card className="empty-card"><h2>Study set not found</h2><p>This set may only exist in another browser.</p></Card></div>;

  return <div className="page-stack material-viewer"><header className="page-heading"><span className="eyebrow">{studySet.sourceType} · {studySet.sourceName}</span><h1>{studySet.title}</h1><p>{studySet.chunks.length} text chunks ready for AI study modes.</p></header>{children}<Card><details><summary className="source-summary">Source text</summary><pre className="material-text">{studySet.chunks.join("")}</pre></details></Card></div>;
}
