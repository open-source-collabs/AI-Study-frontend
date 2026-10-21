import { Suspense } from "react";
import { MaterialViewer } from "@/features/material";

export default function SummaryPage({ params }: { params: Promise<{ setId: string }> }) {
  return <Suspense fallback={<div className="page-stack"><div className="loading-state">Loading study set...</div></div>}>
    {params.then(({ setId }) => <MaterialViewer setId={setId} />)}
  </Suspense>;
}
