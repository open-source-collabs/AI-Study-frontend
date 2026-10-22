import { generate, summaryPrompt, type AIProvider } from "@/core/ai";
import { summarySchema } from "../types";

export function generateSummary(provider: AIProvider, model: string, material: string) {
  return generate(provider, { ...summaryPrompt(material), model, schema: summarySchema });
}
