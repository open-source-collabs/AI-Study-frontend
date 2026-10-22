import type { z } from "zod";
import type { ProviderTransport } from "./types";

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

export function statusToError(status: number) {
  if (status === 401 || status === 403) return new ProviderError("unauthorized", "The provider rejected the API key.", status);
  if (status === 429) return new ProviderError("rate_limited", "The provider rate limit was reached.", status);
  if (status >= 500) return new ProviderError("unavailable", "The provider is temporarily unavailable.", status);
  return new ProviderError("request_failed", "The provider request failed.", status);
}

// Shared by every adapter: typed errors only, never raw fetch/provider text (it can echo keys or headers).
export async function requestStructured<Body, T>(
  transport: ProviderTransport,
  url: string,
  init: RequestInit,
  readContent: (body: Body) => string | undefined,
  schema: z.ZodType<T>,
): Promise<T> {
  let response: Response;
  try {
    response = await transport(url, init);
  } catch {
    throw new ProviderError("unavailable", "Could not reach the provider. Check your connection and try again.");
  }
  if (!response.ok) throw statusToError(response.status);

  let content: string | undefined;
  try {
    content = readContent((await response.json()) as Body);
  } catch {
    content = undefined;
  }
  if (!content) throw new ProviderError("invalid_response", "The provider returned no content.", response.status);

  try {
    return schema.parse(JSON.parse(content));
  } catch {
    throw new ProviderError("invalid_response", "The provider returned an invalid structured response.", response.status);
  }
}
