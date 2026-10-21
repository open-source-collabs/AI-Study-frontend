export type ProviderId = "openrouter" | "groq" | "gemini";

export type ProviderDefinition = {
  id: ProviderId;
  label: string;
  baseUrl: string;
  defaultModel: string;
  modelHint: string;
};

export const PROVIDERS: ProviderDefinition[] = [
  { id: "openrouter", label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", defaultModel: "openai/gpt-4o-mini", modelHint: "OpenRouter model id" },
  { id: "groq", label: "Groq", baseUrl: "https://api.groq.com/openai/v1", defaultModel: "llama-3.3-70b-versatile", modelHint: "Groq model id" },
  { id: "gemini", label: "Gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta", defaultModel: "gemini-2.0-flash", modelHint: "Gemini model id" },
];

export type ProviderSettings = {
  providerId: ProviderId;
  apiKey: string;
  model: string;
  rememberOnDevice: boolean;
};
