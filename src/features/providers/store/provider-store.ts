"use client";

import { create } from "zustand";
import { providerCredentialRepository } from "@/core/storage";
import { PROVIDERS, type ProviderId, type ProviderSettings } from "../types";

type ProviderStore = ProviderSettings & {
  hasRememberedKey: boolean;
  hydrated: boolean;
  setSettings: (settings: Partial<ProviderSettings>) => void;
  hydrate: () => Promise<void>;
  loadRemembered: (providerId: ProviderId) => Promise<void>;
  save: () => Promise<void>;
  removeRemembered: () => Promise<void>;
};

const defaultModel = (providerId: ProviderId) => PROVIDERS.find((item) => item.id === providerId)?.defaultModel ?? "";

export const useProviderStore = create<ProviderStore>((set, get) => ({
  providerId: "openrouter",
  apiKey: "",
  model: defaultModel("openrouter"),
  rememberOnDevice: false,
  hasRememberedKey: false,
  hydrated: false,
  setSettings: (settings) => {
    const { providerId } = settings;
    if (providerId && providerId !== get().providerId) {
      // A key and model belong to one provider, so switching starts clean, then picks up that provider's saved key.
      set({ apiKey: "", model: defaultModel(providerId), rememberOnDevice: false, hasRememberedKey: false, ...settings });
      void get().loadRemembered(providerId);
    } else {
      set(settings);
    }
  },
  // Once per page load: restores the most recently remembered provider. In-memory keys are never overwritten.
  hydrate: async () => {
    if (get().hydrated) return;
    set({ hydrated: true });
    const saved = await providerCredentialRepository.latest();
    const savedProvider = PROVIDERS.find((item) => item.id === saved?.providerId);
    if (saved && savedProvider && !get().apiKey) {
      set({ providerId: savedProvider.id, apiKey: saved.apiKey, model: saved.model, rememberOnDevice: true, hasRememberedKey: true });
    }
  },
  loadRemembered: async (providerId) => {
    const saved = await providerCredentialRepository.get(providerId);
    // The student may have switched provider again while this was loading.
    if (saved && get().providerId === providerId) {
      set({ apiKey: saved.apiKey, model: saved.model, rememberOnDevice: true, hasRememberedKey: true });
    }
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
