import { Plus } from "lucide-react";
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
  ["What can I upload?", "Pasted notes, text and Markdown files, and computer-generated PDFs with a text layer (up to 10 MB and 300 pages). Scanned PDFs are not supported yet."],
  ["Where will my API key go?", "Your key stays in memory and is only sent to the AI provider you chose. It is stored in this browser only if you tick \"Remember this key on this device\", and you can remove it at any time."],
  ["Who sees my study material?", "Your material is stored in this browser only. When you generate something, the text (or just the relevant passages for questions) is sent to your chosen AI provider."],
  ["Will content regenerate every time?", "No. Generated outputs are designed to be stored and shown again. Regeneration behavior remains an open product decision."],
];

export const metadata = { title: "Help" };

export default function HelpPage() {
  return <div className="help-layout"><div className="help-content page-stack"><header className="page-heading">
    <Chip>System guide</Chip>
    <h1>How StudyOS works</h1>
    <p>Turn your notes into a focused study session.</p>
    <span className="meta-line">4 steps · Built for active recall</span>
  </header><Card className="quick-start-card" id="quick-start"><div><span className="eyebrow">Quick start</span>
    <h2>Ready to dive in?</h2><p>Add your AI provider key, then upload your first notes or PDF.</p></div>
      <div className="hero-actions"><Link className="button button-primary" href="/setting/provider">Configure provider</Link>
        <Link className="button button-secondary" href="/">Open dashboard</Link></div></Card><section className="section-block" id="steps">
      <div className="section-heading">
        <div><span className="eyebrow">The study loop</span>
          <h2>Four focused steps</h2></div></div>
      <div className="guide-steps">{steps.map((step) => <Card className="guide-step" key={step.number}><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></Card>)}</div></section>
    <section className="section-block" id="faq"><div className="section-heading">
      <div><span className="eyebrow">FAQ</span>
        <h2>Common questions</h2></div></div>
      <div className="faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<Plus aria-hidden="true" size={16} /></summary><p>{answer}</p></details>)}</div></section></div><aside className="help-aside">
      <span className="eyebrow">On this page</span><nav className="toc">
        <a href="#quick-start">Quick start</a>
        <a href="#steps">The study loop</a><a href="#faq">Common questions</a></nav>
    </aside>
  </div>;
}
