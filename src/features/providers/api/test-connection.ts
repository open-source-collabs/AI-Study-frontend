import { z } from "zod";
import type { ProviderTransport } from "@/core/ai";
import type { ProviderSettings } from "../types";
import { createProvider } from "./create-provider";

export async function testProviderConnection(settings: ProviderSettings, transport: ProviderTransport) {
  const provider = createProvider(settings, transport);
  await provider.generateStructured({ system: "Return only JSON with ok set to true.", prompt: "Connection test.", model: settings.model, schema: z.object({ ok: z.boolean() }) });
  return true;
}
