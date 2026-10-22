import { beforeEach, describe, expect, it, vi } from "vitest";

const repo = vi.hoisted(() => ({ get: vi.fn(), save: vi.fn(), remove: vi.fn() }));
vi.mock("@/core/storage", () => ({ providerCredentialRepository: repo }));

import { useProviderStore } from "./provider-store";

describe("provider store", () => {
  beforeEach(() => vi.clearAllMocks());

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
});
