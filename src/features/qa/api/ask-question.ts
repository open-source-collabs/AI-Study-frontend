import { generate, qaPrompt, type AIProvider } from "@/core/ai";
import { qaSchema } from "../types";
import { retrieveChunks } from "./retrieve";

export const NOT_FOUND_ANSWER = "I could not find anything about that in your material.";

const squash = (text: string) => text.replace(/\s+/g, " ").trim().toLowerCase();

export async function askQuestion(provider: AIProvider, model: string, chunks: string[], question: string) {
  const passages = retrieveChunks(chunks, question);
  // Nothing related in the material: say so without spending a model call (or inviting a made-up answer).
  if (!passages.length) return { answer: NOT_FOUND_ANSWER, sources: [] };

  const result = await generate(provider, { ...qaPrompt(question, passages), model, schema: qaSchema });
  // Keep only quotes that really appear in the material the model was given, so a source is never invented.
  const material = squash(passages.join(" "));
  const sources = [...new Set(result.quotes.filter((quote) => material.includes(squash(quote))))];
  return { answer: result.answer, sources };
}
