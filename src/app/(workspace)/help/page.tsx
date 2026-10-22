import Link from "next/link";
import { Card } from "@/core/components/Card";
import { Chip } from "@/core/components/Chip";

const steps = [
  { number: "01", title: "Add material", text: "Bring in notes or text-layer PDFs. StudyOS will keep the source attached to the study set." },
  { number: "02", title: "Choose a provider", text: "Connect the provider you prefer. Your key remains a user-owned secret." },
  { number: "03", title: "Study with structure", text: "Turn material into summaries, flashcards, quizzes, and grounded questions." },
  { number: "04", title: "Track progress", text: "Review your activity and continue from the last checkpoint." },
];

const faqs = [
  ["What can I upload?", "Phase 1 supports notes and computer-generated PDFs with a text layer. OCR is intentionally out of scope for the MVP."],
  ["Where will my API key go?", "The frontend will keep the key out of NEXT_PUBLIC variables and follow the storage decision in the security rules."],
  ["Will content regenerate every time?", "No. Generated outputs are designed to be stored and shown again. Regeneration behavior remains an open product decision."],
];

export default function HelpPage() {
  return <div className="help-layout"><div className="help-content page-stack"><header className="page-heading">
    <Chip>System guide</Chip>
    <h1>How StudyOS works</h1>
    <p>Turn your notes into a focused study session.</p>
    <span className="meta-line">4 steps · Frontend foundation · Built for active recall</span>
  </header><Card className="quick-start-card"><div><span className="eyebrow">Quick start</span>
    <h2>Ready to dive in?</h2><p>Start with the workspace foundation while the backend API contract is being prepared.</p></div>
      <div className="hero-actions"><Link className="button button-primary" href="/setting/provider">Configure provider</Link>
        <Link className="button button-secondary" href="/">Open dashboard</Link></div></Card><section className="section-block" id="steps">
      <div className="section-heading">
        <div><span className="eyebrow">The study loop</span>
          <h2>Four focused steps</h2></div></div>
      <div className="guide-steps">{steps.map((step) => <Card className="guide-step" key={step.number}><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></Card>)}</div></section>
    <section className="section-block" id="faq"><div className="section-heading">
      <div><span className="eyebrow">FAQ</span>
        <h2>Common questions</h2></div></div>
      <div className="faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section></div><aside className="help-aside">
      <span className="eyebrow">On this page</span><nav className="toc">
        <a href="#quick-start">Quick start</a>
        <a href="#steps">The study loop</a><a href="#faq">Common questions</a></nav>
      <Card className="shortcut-card"><span className="eyebrow">Keyboard shortcuts</span>
        <div><span>Search</span><kbd>Ctrl + K</kbd></div><div><span>Upload</span><kbd>Ctrl + U</kbd></div>
        <div><span>Flip card</span><kbd>Space</kbd></div></Card></aside></div>;
}
