"use client";

import { useCallback } from "react";
import { useGeneratedOutput } from "@/core/hooks/use-generated-output";
import { useAIProvider } from "@/features/providers";
import { generateQuiz } from "../api/generate-quiz";
import { quizSchema } from "../types";

export function useQuiz(setId: string) {
  const ai = useAIProvider();
  const create = useCallback(async (material: string) => {
    if (!ai) throw new Error("No provider configured.");
    return generateQuiz(ai.provider, ai.model, material);
  }, [ai]);
  return { ...useGeneratedOutput({ setId, kind: "quiz", schema: quizSchema, create }), canGenerate: Boolean(ai) };
}
