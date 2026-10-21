import Link from "next/link";
import { Card } from "@/core/components/Card";
import { Chip } from "@/core/components/Chip";
import { UploadDropzone } from "@/features/material";
import { StudySetList } from "@/features/study-sets";

export default function DashboardPage() {
  return <div className="page-stack">
    <header className="page-heading dashboard-heading"><div><span className="eyebrow">Tuesday, October 21</span><h1>Good morning, learner.</h1><p>Pick up where you left off or start a focused study session.</p></div><Link className="button button-primary" href="/help">How it works</Link></header>
    <section className="hero-card"><div><Chip>Core loop</Chip><h2>Turn material into momentum.</h2><p>Upload your notes, choose a provider, and move through structured study modes built for active recall.</p><div className="hero-actions"><Link className="button button-primary" href="/setting/provider">Configure provider</Link><Link className="button button-secondary" href="/help">Read the guide</Link></div></div><div className="hero-stat"><span className="eyebrow">Weekly streak</span><strong>4</strong><span>days of focused study</span></div></section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">Your workspace</span><h2>Study sets</h2></div><span className="muted-text">Saved in this browser</span></div><StudySetList /></section>
    <UploadDropzone />
    <section className="dashboard-columns"><Card><div className="section-heading compact"><div><span className="eyebrow">Next up</span><h2>Continue learning</h2></div><span className="chip chip-teal">24 min</span></div><div className="next-session"><div className="session-icon" aria-hidden="true">◆</div><div><h3>Flashcard review</h3><p>Your next study session will appear here.</p></div><Link className="text-link" href="/sets/demo/flashcards">Open →</Link></div></Card><Card><div className="section-heading compact"><div><span className="eyebrow">Foundation</span><h2>Getting started</h2></div><span className="chip">1 of 4</span></div><ol className="steps-list"><li className="step-done"><span>✓</span>Explore the workspace</li><li><span>2</span>Configure an AI provider</li><li><span>3</span>Upload your first material</li></ol><Link className="text-link" href="/help">View all steps →</Link></Card></section>
  </div>;
}
