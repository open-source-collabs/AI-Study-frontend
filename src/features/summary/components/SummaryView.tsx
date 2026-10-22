"use client";

import { Card } from "@/core/components/Card";
import { OutputStates } from "@/core/components/OutputStates";
import { useVisitCheckpoint } from "@/core/hooks/use-checkpoint";
import { useSummary } from "../hooks/useSummary";

export function SummaryView({ setId }: { setId: string }) {
  const { data, error, generate, status, canGenerate } = useSummary(setId);
  useVisitCheckpoint(setId, "summary");
  return <OutputStates canGenerate={canGenerate} error={error} label="summary" onGenerate={generate} status={status}>
    {data && <Card className="summary-card">
      <span className="eyebrow">Summary</span>
      <h2>{data.title}</h2>
      <p className="summary-overview">{data.overview}</p>
      {data.sections.map((section) => <section key={section.heading}>
        <h3>{section.heading}</h3>
        <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>
      </section>)}
    </Card>}
  </OutputStates>;
}
