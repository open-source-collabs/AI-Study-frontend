import { z } from "zod";
import { GeminiProvider, OpenAICompatibleProvider, type ProviderTransport } from "@/core/ai";
import { PROVIDERS, type ProviderSettings } from "../types";

export async function testProviderConnection(settings: ProviderSettings, transport: ProviderTransport) {
  const definition = PROVIDERS.find((provider) => provider.id === settings.providerId);
  if (!definition) throw new Error("Unsupported provider.");
  const config = { apiKey: settings.apiKey, baseUrl: definition.baseUrl, model: settings.model };
  const provider = settings.providerId === "gemini" ? new GeminiProvider(config, transport) : new OpenAICompatibleProvider(config, transport);
  await provider.generateStructured({ system: "Return only JSON with ok set to true.", prompt: "Connection test.", model: settings.model, schema: z.object({ ok: z.boolean() }) });
  return true;
}
