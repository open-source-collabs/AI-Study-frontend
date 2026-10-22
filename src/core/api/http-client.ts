import type { ProviderTransport } from "@/core/ai";

// Browser-direct transport. The 60s limit stops a stalled request from leaving a loading state on screen forever.
export const browserTransport: ProviderTransport = (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(60_000) });
