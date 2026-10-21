"use client";

import { useEffect } from "react";
import { useProviderStore } from "../store/provider-store";

export function useProvider() {
  const provider = useProviderStore();
  const providerId = useProviderStore((state) => state.providerId);
  const loadRemembered = useProviderStore((state) => state.loadRemembered);
  useEffect(() => { void loadRemembered(providerId); }, [loadRemembered, providerId]);
  return provider;
}
