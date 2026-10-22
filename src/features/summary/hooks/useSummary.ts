"use client";

import { useCallback } from "react";
import { useGeneratedOutput } from "@/core/hooks/use-generated-output";
import { useAIProvider } from "@/features/providers";
import { generateSummary } from "../api/generate-summary";
import { summarySchema } from "../types";

export function useSummary(setId: string) {
  const ai = useAIProvider();
  const create = useCallback(async (material: string) => {
    if (!ai) throw new Error("No provider configured.");
    return generateSummary(ai.provider, ai.model, material);
  }, [ai]);
  return { ...useGeneratedOutput({ setId, kind: "summary", schema: summarySchema, create }), canGenerate: Boolean(ai) };
}
