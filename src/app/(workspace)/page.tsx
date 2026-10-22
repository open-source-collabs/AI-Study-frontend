import Link from "next/link";
import { Card } from "@/core/components/Card";
import { Chip } from "@/core/components/Chip";
import { UploadDropzone } from "@/features/material";
import { StudySetList } from "@/features/study-sets";

export default function DashboardPage() {
  return <div className="page-stack">
    <header className="page-heading dashboard-heading"><div>
      <span className="eyebrow">Dashboard</span>
      <h1>Welcome, learner.</h1>
      <p>Pick up where you left off or start a focused study session.</p></div>
      <Link className="button button-primary" href="/help">How it works</Link></header>
    <section className="hero-card"><div>
      <Chip>Core loop</Chip>
      <h2>Turn material into momentum.</h2>
      <p>Upload your notes, choose a provider, and move through structured study modes built for active recall.</p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/setting/provider">Configure provider</Link>
        <Link className="button button-secondary" href="/help">Read the guide</Link>
      </div>
    </div></section>
    <section className="section-block">
      <div className="section-heading"><div>
        <span className="eyebrow">Your workspace</span>
        <h2>Study sets</h2></div><span className="muted-text">Saved in this browser</span></div><StudySetList /></section>
    <UploadDropzone />
    <section className="dashboard-columns">
      <Card><div className="section-heading compact"><div>
        <span className="eyebrow">Foundation</span>
        <h2>Getting started</h2></div></div><ol className="steps-list"><li><span>1</span>Explore the workspace</li>
          <li><span>2</span>Configure an AI provider</li><li><span>3</span>Upload your first material</li></ol>
        <Link className="text-link" href="/help">View all steps →</Link></Card></section>
  </div>;
}
