import type { AIProvider, ProviderTransport } from "./types";

export type ProviderClientConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export type ProviderErrorCode = "unauthorized" | "rate_limited" | "unavailable" | "invalid_response" | "request_failed";

export class ProviderError extends Error {
  constructor(public readonly code: ProviderErrorCode, message: string, public readonly status?: number) {
    super(message);
    this.name = "ProviderError";
  }
}

export type ProviderFactory = (config: ProviderClientConfig, transport: ProviderTransport) => AIProvider;
