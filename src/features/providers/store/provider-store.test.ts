import { beforeEach, describe, expect, it, vi } from "vitest";

const repo = vi.hoisted(() => ({ get: vi.fn(), latest: vi.fn(), save: vi.fn(), remove: vi.fn() }));
vi.mock("@/core/storage", () => ({ providerCredentialRepository: repo }));

import { useProviderStore } from "./provider-store";

const reset = () => useProviderStore.setState({ providerId: "openrouter", apiKey: "", model: "m", rememberOnDevice: false, hasRememberedKey: false, hydrated: false });

describe("provider store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    repo.get.mockResolvedValue(undefined);
    repo.latest.mockResolvedValue(undefined);
    reset();
  });

  it("keeps the key in memory only unless the student opts in", async () => {
    useProviderStore.setState({ providerId: "groq", apiKey: "secret", rememberOnDevice: false });
    await useProviderStore.getState().save();
    expect(repo.save).not.toHaveBeenCalled();
    expect(repo.remove).toHaveBeenCalledWith("groq");
  });

  it("stores the key when the student opts in", async () => {
    useProviderStore.setState({ providerId: "groq", apiKey: "secret", model: "m", rememberOnDevice: true });
    await useProviderStore.getState().save();
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ providerId: "groq", apiKey: "secret" }));
  });

  it("does not wipe a key held in memory when nothing is saved for the provider", async () => {
    useProviderStore.setState({ apiKey: "typed-key" });
    await useProviderStore.getState().loadRemembered("openrouter");
    expect(useProviderStore.getState().apiKey).toBe("typed-key");
  });

  it("restores the most recently remembered provider once, on load", async () => {
    repo.latest.mockResolvedValue({ id: "groq", providerId: "groq", apiKey: "saved", model: "llama", updatedAt: 1 });
    await useProviderStore.getState().hydrate();
    await useProviderStore.getState().hydrate();
    expect(repo.latest).toHaveBeenCalledTimes(1);
    expect(useProviderStore.getState()).toMatchObject({ providerId: "groq", apiKey: "saved", hasRememberedKey: true });
  });

  it("starts clean when the student switches provider", () => {
    useProviderStore.setState({ providerId: "openrouter", apiKey: "old-provider-key" });
    useProviderStore.getState().setSettings({ providerId: "gemini" });
    expect(useProviderStore.getState()).toMatchObject({ providerId: "gemini", apiKey: "" });
  });
});
