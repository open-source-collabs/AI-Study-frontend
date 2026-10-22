"use client";

import { useCallback } from "react";
import { useGeneratedOutput } from "@/core/hooks/use-generated-output";
import { useAIProvider } from "@/features/providers";
import { generateFlashcards } from "../api/generate-flashcard";
import { flashcardsSchema } from "../types";

export function useFlashcards(setId: string) {
  const ai = useAIProvider();
  const create = useCallback(async (material: string) => {
    if (!ai) throw new Error("No provider configured.");
    return generateFlashcards(ai.provider, ai.model, material);
  }, [ai]);
  return { ...useGeneratedOutput({ setId, kind: "flashcards", schema: flashcardsSchema, create }), canGenerate: Boolean(ai) };
}
