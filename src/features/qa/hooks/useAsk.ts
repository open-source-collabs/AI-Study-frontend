"use client";

import { useRef, useState } from "react";
import { ProviderError } from "@/core/ai";
import { studySetRepository } from "@/core/storage";
import { useAIProvider } from "@/features/providers";
import { askQuestion } from "../api/ask-question";
import type { Exchange } from "../types";

// The conversation is session-only on purpose: the answers are cheap to ask again and the material is the source of truth.
export function useAsk(setId: string) {
  const ai = useAIProvider();
  const nextId = useRef(0);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);

  function update(id: number, changes: Partial<Exchange>) {
    setExchanges((current) => current.map((exchange) => (exchange.id === id ? { ...exchange, ...changes } : exchange)));
  }

  async function ask(question: string) {
    if (!ai) return;
    const id = nextId.current++;
    setExchanges((current) => [...current, { id, question, status: "asking" }]);
    try {
      const studySet = await studySetRepository.get(setId);
      if (!studySet) throw new Error("Study set not found.");
      const { answer, sources } = await askQuestion(ai.provider, ai.model, studySet.chunks, question);
      update(id, { status: "done", answer, sources });
    } catch (cause) {
      // Only our own typed errors are safe to show; anything else may echo provider internals.
      update(id, { status: "error", error: cause instanceof ProviderError ? cause.message : "Could not answer this. Please try again." });
    }
  }

  return { ask, canAsk: Boolean(ai), exchanges, isAsking: exchanges.some((exchange) => exchange.status === "asking") };
}
