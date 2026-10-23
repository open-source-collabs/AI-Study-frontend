import { Suspense } from "react";
import { MaterialViewer } from "@/features/material";
import { SummaryView } from "@/features/summary";

export const metadata = { title: "Summary" };

export default function SummaryPage({ params }: { params: Promise<{ setId: string }> }) {
  return <Suspense fallback={<div className="page-stack"><div className="loading-state">Loading study set..</div></div>}>
    {params.then(({ setId }) => <MaterialViewer setId={setId}><SummaryView setId={setId} /></MaterialViewer>)}
  </Suspense>;
}
