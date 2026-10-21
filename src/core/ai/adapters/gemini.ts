import { ProviderError, type ProviderClientConfig } from "../provider";
import type { AIProvider, ProviderTransport, StructuredGenerationRequest } from "../types";

type GeminiResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };

export class GeminiProvider implements AIProvider {
  readonly id = "gemini";

  constructor(private readonly config: ProviderClientConfig, private readonly transport: ProviderTransport) {}

  async generateStructured<T>(request: StructuredGenerationRequest<T>) {
    const endpoint = `${this.config.baseUrl.replace(/\/$/, "")}/models/${encodeURIComponent(request.model)}:generateContent?key=${encodeURIComponent(this.config.apiKey)}`;
    const response = await this.transport(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: request.system }] }, contents: [{ parts: [{ text: request.prompt }] }], generationConfig: { responseMimeType: "application/json" } }),
    });
    if (!response.ok) throw geminiError(response.status);
    const body = await response.json() as GeminiResponse;
    const content = body.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("");
    if (!content) throw new ProviderError("invalid_response", "The provider returned no content.", response.status);
    try {
      return request.schema.parse(JSON.parse(content));
    } catch {
      throw new ProviderError("invalid_response", "The provider returned an invalid structured response.", response.status);
    }
  }
}

function geminiError(status: number) {
  if (status === 401 || status === 403) return new ProviderError("unauthorized", "The provider rejected the API key.", status);
  if (status === 429) return new ProviderError("rate_limited", "The provider rate limit was reached.", status);
  if (status >= 500) return new ProviderError("unavailable", "The provider is temporarily unavailable.", status);
  return new ProviderError("request_failed", "The provider request failed.", status);
}
