import { Suspense } from "react";
import { AskPanel } from "@/features/qa";

export const metadata = { title: "Ask" };

export default function AskPage({ params }: { params: Promise<{ setId: string }> }) {
  return <div className="page-stack">
    <header className="page-heading">
      <span className="eyebrow">Ask</span>
      <h1>Ask your material</h1>
      <p>Ask grounded questions and keep answers connected to the uploaded source.</p>
    </header>
    <Suspense fallback={<div className="loading-state">Loading...</div>}>{params.then(({ setId }) => <AskPanel setId={setId} />)}</Suspense>
  </div>;
}
