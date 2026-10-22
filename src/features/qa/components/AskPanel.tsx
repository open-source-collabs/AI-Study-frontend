"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { Input } from "@/core/components/Input";
import { useVisitCheckpoint } from "@/core/hooks/use-checkpoint";
import { NOT_FOUND_ANSWER } from "../api/ask-question";
import { useAsk } from "../hooks/useAsk";
import type { Exchange } from "../types";

function ExchangeCard({ exchange }: { exchange: Exchange }) {
  return <Card className="exchange">
    <p className="exchange-question">{exchange.question}</p>
    {exchange.status === "asking" && <p className="muted-text" role="status">Looking through your material...</p>}
    {exchange.status === "error" && <p className="form-error" role="alert">{exchange.error}</p>}
    {exchange.status === "done" && <>
      <p className="exchange-answer">{exchange.answer}</p>
      {exchange.sources?.map((source) => <blockquote className="source-quote" key={source}><span className="eyebrow">From your material</span>{source}</blockquote>)}
      {exchange.sources?.length === 0 && exchange.answer !== NOT_FOUND_ANSWER && <p className="field-help">No matching passage was found for this answer, so double-check it against your material.</p>}
    </>}
  </Card>;
}

export function AskPanel({ setId }: { setId: string }) {
  const { ask, canAsk, exchanges, isAsking } = useAsk(setId);
  const [question, setQuestion] = useState("");
  useVisitCheckpoint(setId, "ask");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = question.trim();
    if (!text || isAsking) return;
    setQuestion("");
    void ask(text);
  }

  return <div className="ask-panel">
    {!canAsk && <Card className="empty-card"><h2>Add your API key to ask questions</h2><p>Answers come from your own AI provider, using only your material.</p><div className="empty-actions"><Link className="button button-primary" href="/setting/provider">Provider settings</Link></div></Card>}
    {canAsk && !exchanges.length && <p className="field-help">Ask anything about this material. Answers stay tied to your text and show the passage they came from. Only the few most relevant passages are sent to your AI provider.</p>}
    <div aria-live="polite" className="exchange-list">{exchanges.map((exchange) => <ExchangeCard exchange={exchange} key={exchange.id} />)}</div>
    <form className="ask-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="ask-question">Your question</label>
      <Input disabled={!canAsk} id="ask-question" maxLength={500} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about this material..." value={question} />
      <Button disabled={!canAsk || isAsking || !question.trim()} type="submit">Ask</Button>
    </form>
  </div>;
}
