import { ProviderError, type ProviderClientConfig } from "../provider";
import type { AIProvider, ProviderTransport, StructuredGenerationRequest } from "../types";

type OpenAIResponse = { choices?: Array<{ message?: { content?: string | null } }> };

export class OpenAICompatibleProvider implements AIProvider {
  readonly id = "openai-compatible";

  constructor(private readonly config: ProviderClientConfig, private readonly transport: ProviderTransport) {}

  async generateStructured<T>(request: StructuredGenerationRequest<T>) {
    const response = await this.transport(`${this.config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: request.model, messages: [{ role: "system", content: request.system }, { role: "user", content: request.prompt }], response_format: { type: "json_object" } }),
    });
    if (!response.ok) throw providerError(response.status);
    const body = await response.json() as OpenAIResponse;
    const content = body.choices?.[0]?.message?.content;
    if (!content) throw new ProviderError("invalid_response", "The provider returned no content.", response.status);
    try {
      return request.schema.parse(JSON.parse(content));
    } catch {
      throw new ProviderError("invalid_response", "The provider returned an invalid structured response.", response.status);
    }
  }
}

function providerError(status: number) {
  if (status === 401 || status === 403) return new ProviderError("unauthorized", "The provider rejected the API key.", status);
  if (status === 429) return new ProviderError("rate_limited", "The provider rate limit was reached.", status);
  if (status >= 500) return new ProviderError("unavailable", "The provider is temporarily unavailable.", status);
  return new ProviderError("request_failed", "The provider request failed.", status);
}
