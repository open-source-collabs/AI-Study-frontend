"use client";

import { useMemo } from "react";
import { browserTransport } from "@/core/api/http-client";
import { createProvider } from "../api/create-provider";
import { useProvider } from "./useProvider";

// The student's configured provider, or null until a key is available. Other features use this instead of touching adapters.
export function useAIProvider() {
  const { providerId, apiKey, model } = useProvider();
  return useMemo(() => {
    if (!apiKey.trim() || !model.trim()) return null;
    return { model, provider: createProvider({ providerId, apiKey, model }, browserTransport) };
  }, [providerId, apiKey, model]);
}
