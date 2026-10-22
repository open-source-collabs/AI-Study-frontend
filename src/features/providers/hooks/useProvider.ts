"use client";

import { useEffect } from "react";
import { useProviderStore } from "../store/provider-store";

export function useProvider() {
  const provider = useProviderStore();
  const hydrate = useProviderStore((state) => state.hydrate);
  useEffect(() => { void hydrate(); }, [hydrate]);
  return provider;
}
