import { generate, quizPrompt, type AIProvider } from "@/core/ai";
import { quizSchema } from "../types";

export function generateQuiz(provider: AIProvider, model: string, material: string) {
  return generate(provider, { ...quizPrompt(material), model, schema: quizSchema });
}
