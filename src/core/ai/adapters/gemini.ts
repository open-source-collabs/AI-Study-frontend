import { requestStructured, type ProviderClientConfig } from "../provider";
import type { AIProvider, ProviderTransport, StructuredGenerationRequest } from "../types";

type GeminiResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };

export class GeminiProvider implements AIProvider {
  readonly id = "gemini";

  constructor(private readonly config: ProviderClientConfig, private readonly transport: ProviderTransport) {}

  generateStructured<T>(request: StructuredGenerationRequest<T>) {
    return requestStructured<GeminiResponse, T>(
      this.transport,
      `${this.config.baseUrl.replace(/\/$/, "")}/models/${encodeURIComponent(request.model)}:generateContent`,
      {
        method: "POST",
        // Key goes in a header, not the URL, so it never shows up in logs or tooling that record URLs.
        headers: { "x-goog-api-key": this.config.apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: request.system }] }, contents: [{ parts: [{ text: request.prompt }] }], generationConfig: { responseMimeType: "application/json" } }),
      },
      (body) => body.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join(""),
      request.schema,
    );
  }
}
