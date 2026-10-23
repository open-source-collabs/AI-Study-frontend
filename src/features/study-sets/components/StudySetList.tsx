"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/core/components/Card";
import { useStoredStudySets } from "@/core/hooks/use-stored-study-sets";

export function StudySetList() {
  const { error, isLoading, studySets } = useStoredStudySets();

  if (isLoading) return <div className="loading-state">Loading study sets...</div>;
  if (error) return <p className="form-error" role="alert">{error}</p>;
  if (!studySets.length) return <Card className="empty-card"><h2>No study sets yet</h2><p>Add notes or a PDF below to create your first set.</p></Card>;

  return <div className="set-list">{studySets.map((studySet) => <Link className="saved-set" href={`/sets/${studySet.id}/summary`} key={studySet.id}><div><strong>{studySet.title}</strong><span>{studySet.sourceType.toUpperCase()} · {studySet.chunks.length} chunks</span></div><span aria-hidden="true"><ChevronRight size={18} /></span></Link>)}</div>;
}
