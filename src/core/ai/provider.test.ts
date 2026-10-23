import { describe, expect, it } from "vitest";
import { z } from "zod";
import { GeminiProvider } from "./adapters/gemini";
import { requestStructured } from "./provider";
import type { ProviderTransport } from "./types";

const schema = z.object({ ok: z.boolean() });
const readText = (body: { text?: string }) => body.text;
const reply = (status: number, body: unknown): ProviderTransport => async () => new Response(JSON.stringify(body), { status });
const run = (transport: ProviderTransport) => requestStructured(transport, "https://provider.test", {}, readText, schema);

describe("requestStructured", () => {
  it("returns validated output", async () => {
    await expect(run(reply(200, { text: '{"ok":true}' }))).resolves.toEqual({ ok: true });
  });

  it.each([
    [401, "unauthorized"],
    [403, "unauthorized"],
    [429, "rate_limited"],
    [503, "unavailable"],
    [400, "request_failed"],
    [404, "request_failed"],
  ])("maps HTTP %i to %s", async (status, code) => {
    await expect(run(reply(status, {}))).rejects.toMatchObject({ code });
  });

  it("tells the student when the model name is unknown", async () => {
    await expect(run(reply(404, {}))).rejects.toThrow("does not know this model");
  });

  it("maps a network failure to a typed error", async () => {
    const offline: ProviderTransport = async () => { throw new TypeError("Failed to fetch"); };
    await expect(run(offline)).rejects.toMatchObject({ code: "unavailable" });
  });

  it("rejects empty, non-JSON and wrongly shaped content", async () => {
    await expect(run(reply(200, {}))).rejects.toMatchObject({ code: "invalid_response" });
    await expect(run(reply(200, { text: "not json" }))).rejects.toMatchObject({ code: "invalid_response" });
    await expect(run(reply(200, { text: '{"ok":"yes"}' }))).rejects.toMatchObject({ code: "invalid_response" });
  });
});

describe("GeminiProvider", () => {
  it("sends the API key in a header, never in the URL", async () => {
    let seen: { url: string; headers: HeadersInit | undefined } | undefined;
    const transport: ProviderTransport = async (url, init) => {
      seen = { url, headers: init.headers };
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"ok":true}' }] } }] }));
    };
    const provider = new GeminiProvider({ apiKey: "secret-key", baseUrl: "https://g.test/v1beta", model: "m" }, transport);
    await provider.generateStructured({ system: "s", prompt: "p", model: "m", schema });
    expect(seen?.url).not.toContain("secret-key");
    expect(seen?.headers).toMatchObject({ "x-goog-api-key": "secret-key" });
  });
});
