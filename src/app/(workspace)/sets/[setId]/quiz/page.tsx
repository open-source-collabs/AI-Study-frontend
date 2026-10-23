import { Suspense } from "react";
import { QuizView } from "@/features/quiz";

export const metadata = { title: "Quiz" };

export default function QuizPage({ params }: { params: Promise<{ setId: string }> }) {
  return <div className="page-stack">
    <header className="page-heading"><span className="eyebrow">Check yourself</span><h1>Quiz</h1><p>Check your understanding with short, structured multiple-choice questions.</p></header>
    <Suspense fallback={<div className="loading-state">Loading...</div>}>{params.then(({ setId }) => <QuizView setId={setId} />)}</Suspense>
  </div>;
}
