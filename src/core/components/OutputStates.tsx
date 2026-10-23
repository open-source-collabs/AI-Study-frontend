import Link from "next/link";
import type { ReactNode } from "react";
import { MATERIAL_CHAR_LIMIT } from "@/core/ai";
import type { OutputStatus } from "@/core/hooks/use-generated-output";
import { Button } from "./Button";
import { Card } from "./Card";
import { Thinking } from "./Thinking";

type OutputStatesProps = {
  label: string;
  status: OutputStatus;
  error: string | null;
  canGenerate: boolean;
  onGenerate: () => void;
  children: ReactNode;
};

// One place for every AI output view's loading / empty / generating / error states; `children` is the ready view.
export function OutputStates({ label, status, error, canGenerate, onGenerate, children }: OutputStatesProps) {
  if (status === "loading") return <div className="loading-state" role="status">Loading...</div>;
  if (status === "generating") {
    const steps = ["Reading your material...", "Working out the key ideas...", `Writing your ${label}...`, "Almost there, thanks for waiting..."];
    return <Card className="thinking-card"><Thinking skeleton steps={steps} /><p className="muted-text">This can take up to a minute. You can stay on this page.</p></Card>;
  }
  if (status === "error") {
    return <Card className="empty-card"><h2>Something went wrong</h2><p role="alert">{error}</p><div className="empty-actions"><Button onClick={onGenerate} variant="secondary">Try again</Button><Link className="button button-ghost" href="/setting/provider">Provider settings</Link></div></Card>;
  }
  if (status === "empty") {
    return <Card className="empty-card"><h2>No {label} yet</h2><p>We generate it once from your material and save it in this browser. Your text is sent to your chosen AI provider (first {MATERIAL_CHAR_LIMIT.toLocaleString("en-US")} characters).</p><div className="empty-actions">{canGenerate ? <Button onClick={onGenerate}>Generate {label}</Button> : <Link className="button button-primary" href="/setting/provider">Add your API key to generate</Link>}</div></Card>;
  }
  return <>{children}</>;
}
