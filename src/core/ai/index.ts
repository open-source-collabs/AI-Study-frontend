export { GeminiProvider } from "./adapters/gemini";
export { OpenAICompatibleProvider } from "./adapters/openai-compatible";
export { generate } from "./generate";
export { MATERIAL_CHAR_LIMIT, flashcardsPrompt, qaPrompt, quizPrompt, summaryPrompt } from "./prompts";
export { ProviderError } from "./provider";
export type { AIProvider, ProviderTransport, StructuredGenerationRequest } from "./types";
