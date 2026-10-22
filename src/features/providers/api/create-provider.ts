import { GeminiProvider, OpenAICompatibleProvider, type ProviderTransport } from "@/core/ai";
import { PROVIDERS, type ProviderSettings } from "../types";

export function createProvider(settings: Pick<ProviderSettings, "providerId" | "apiKey" | "model">, transport: ProviderTransport) {
  const definition = PROVIDERS.find((provider) => provider.id === settings.providerId);
  if (!definition) throw new Error("Unsupported provider.");
  const config = { apiKey: settings.apiKey, baseUrl: definition.baseUrl, model: settings.model };
  return settings.providerId === "gemini" ? new GeminiProvider(config, transport) : new OpenAICompatibleProvider(config, transport);
}
