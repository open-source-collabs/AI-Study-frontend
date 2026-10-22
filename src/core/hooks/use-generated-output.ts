"use client";

import { useCallback, useEffect, useState } from "react";
import type { z } from "zod";
import { ProviderError } from "@/core/ai";
import { outputRepository, studySetRepository, type OutputKind } from "@/core/storage";

export type OutputStatus = "loading" | "empty" | "generating" | "error" | "ready";

type Options<T> = {
  setId: string;
  kind: OutputKind;
  // Must be a stable reference (module constant). Stored data that no longer matches is treated as missing.
  schema: z.ZodType<T>;
  create: (material: string) => Promise<T>;
};

// Shows the stored output when there is one. Generates (and stores) only when the student asks, so tokens are never spent silently.
export function useGeneratedOutput<T>({ setId, kind, schema, create }: Options<T>) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<OutputStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    outputRepository.get(setId, kind).then((record) => {
      if (!active) return;
      const parsed = record ? schema.safeParse(record.data) : null;
      if (parsed?.success) {
        setData(parsed.data);
        setStatus("ready");
      } else {
        setStatus("empty");
      }
    }).catch(() => {
      if (!active) return;
      setError("Could not read saved study material from this browser.");
      setStatus("error");
    });
    return () => { active = false; };
  }, [setId, kind, schema]);

  const generate = useCallback(async () => {
    setStatus("generating");
    setError(null);
    try {
      const material = (await studySetRepository.get(setId))?.chunks.join("");
      if (!material) throw new Error("This study set has no text to study from.");
      const result = await create(material);
      await outputRepository.put(setId, kind, result);
      setData(result);
      setStatus("ready");
    } catch (cause) {
      // Only our own typed errors are safe to show; anything else may echo provider internals.
      setError(cause instanceof ProviderError ? cause.message : "Could not generate this. Please try again.");
      setStatus("error");
    }
  }, [setId, kind, create]);

  return { data, error, generate, status };
}
