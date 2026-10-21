import type { z } from "zod";

export type ProviderTransport = (input: string, init: RequestInit) => Promise<Response>;

export type StructuredGenerationRequest<T> = {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  model: string;
};

export interface AIProvider {
  readonly id: string;
  generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<T>;
}
