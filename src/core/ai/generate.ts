import { ProviderError } from "./provider";
import type { AIProvider, StructuredGenerationRequest } from "./types";

// Models sometimes return JSON that fails the schema. Retry once, then surface the typed error.
export async function generate<T>(provider: AIProvider, request: StructuredGenerationRequest<T>) {
  try {
    return await provider.generateStructured(request);
  } catch (cause) {
    if (cause instanceof ProviderError && cause.code === "invalid_response") return provider.generateStructured(request);
    throw cause;
  }
}
