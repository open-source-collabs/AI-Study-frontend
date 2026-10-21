"use client";

import Link from "next/link";
import { Card } from "@/core/components/Card";
import { useStudySets } from "../hooks/useStudySets";

export function StudySetList() {
  const { isLoading, studySets } = useStudySets();

  if (isLoading) return <div className="loading-state">Loading study sets...</div>;
  if (!studySets.length) return <Card className="empty-card"><h2>No study sets yet</h2><p>Add notes or a PDF below to create your first set.</p></Card>;

  return <div className="set-list">{studySets.map((studySet) => <Link className="saved-set" href={`/sets/${studySet.id}/summary`} key={studySet.id}><div><strong>{studySet.title}</strong><span>{studySet.sourceType.toUpperCase()} · {studySet.chunks.length} chunks</span></div><span aria-hidden="true">→</span></Link>)}</div>;
}
