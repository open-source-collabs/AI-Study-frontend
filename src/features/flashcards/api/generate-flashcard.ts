import { flashcardsPrompt, generate, type AIProvider } from "@/core/ai";
import { flashcardsSchema } from "../types";

export function generateFlashcards(provider: AIProvider, model: string, material: string) {
  return generate(provider, { ...flashcardsPrompt(material), model, schema: flashcardsSchema });
}
