import { requestStructured, type ProviderClientConfig } from "../provider";
import type { AIProvider, ProviderTransport, StructuredGenerationRequest } from "../types";

type OpenAIResponse = { choices?: Array<{ message?: { content?: string | null } }> };

export class OpenAICompatibleProvider implements AIProvider {
  readonly id = "openai-compatible";

  constructor(private readonly config: ProviderClientConfig, private readonly transport: ProviderTransport) {}

  generateStructured<T>(request: StructuredGenerationRequest<T>) {
    return requestStructured<OpenAIResponse, T>(
      this.transport,
      `${this.config.baseUrl.replace(/\/$/, "")}/chat/completions`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${this.config.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: request.model, messages: [{ role: "system", content: request.system }, { role: "user", content: request.prompt }], response_format: { type: "json_object" } }),
      },
      (body) => body.choices?.[0]?.message?.content ?? undefined,
      request.schema,
    );
  }
}
