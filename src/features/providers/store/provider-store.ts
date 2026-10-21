"use client";

import { create } from "zustand";
import { providerCredentialRepository } from "@/core/storage";
import { PROVIDERS, type ProviderId, type ProviderSettings } from "../types";

type ProviderStore = ProviderSettings & {
  hasRememberedKey: boolean;
  setSettings: (settings: Partial<ProviderSettings>) => void;
  loadRemembered: (providerId: ProviderId) => Promise<void>;
  save: () => Promise<void>;
  removeRemembered: () => Promise<void>;
};

export const useProviderStore = create<ProviderStore>((set, get) => ({
  providerId: "openrouter",
  apiKey: "",
  model: PROVIDERS[0].defaultModel,
  rememberOnDevice: false,
  hasRememberedKey: false,
  setSettings: (settings) => set(settings),
  loadRemembered: async (providerId) => {
    const saved = await providerCredentialRepository.get(providerId);
    const provider = PROVIDERS.find((item) => item.id === providerId);
    set({ providerId, apiKey: saved?.apiKey ?? "", model: saved?.model ?? provider?.defaultModel ?? "", rememberOnDevice: Boolean(saved), hasRememberedKey: Boolean(saved) });
  },
  save: async () => {
    const { apiKey, model, providerId, rememberOnDevice } = get();
    if (rememberOnDevice && apiKey) {
      await providerCredentialRepository.save({ id: providerId, providerId, apiKey, model, updatedAt: Date.now() });
      set({ hasRememberedKey: true });
    } else {
      await providerCredentialRepository.remove(providerId);
      set({ hasRememberedKey: false });
    }
  },
  removeRemembered: async () => {
    const { providerId } = get();
    await providerCredentialRepository.remove(providerId);
    set({ apiKey: "", rememberOnDevice: false, hasRememberedKey: false });
  },
}));
