import { describe, expect, it, vi } from "vitest";
import type { AIProvider } from "@/core/ai";
import { NOT_FOUND_ANSWER, askQuestion } from "./ask-question";
import { retrieveChunks } from "./retrieve";

const chunks = [
  "Mitochondria are the powerhouse of the cell and make ATP.",
  "The French Revolution began in 1789 with the storming of the Bastille.",
  "Photosynthesis happens in chloroplasts.",
];

const providerReturning = (value: unknown) => {
  const generateStructured = vi.fn().mockResolvedValue(value);
  return { generateStructured, provider: { id: "test", generateStructured } as unknown as AIProvider };
};

describe("retrieveChunks", () => {
  it("returns the chunks that share words with the question, best match first in document order", () => {
    expect(retrieveChunks(chunks, "When did the French Revolution begin?")).toEqual([chunks[1]]);
  });

  it("returns nothing when no chunk matches or the question has only filler words", () => {
    expect(retrieveChunks(chunks, "Tell me about quantum computing")).toEqual([]);
    expect(retrieveChunks(chunks, "what is the")).toEqual([]);
  });
});

describe("askQuestion", () => {
  it("does not call the model when nothing in the material is related", async () => {
    const { generateStructured, provider } = providerReturning({});
    await expect(askQuestion(provider, "m", chunks, "Explain quantum computing")).resolves.toEqual({ answer: NOT_FOUND_ANSWER, sources: [] });
    expect(generateStructured).not.toHaveBeenCalled();
  });

  it("keeps quotes found in the material and drops invented ones", async () => {
    const { provider } = providerReturning({ answer: "In 1789.", quotes: ["began in 1789   with the storming", "It began in 1790 in Paris"] });
    const result = await askQuestion(provider, "m", chunks, "When did the French Revolution begin?");
    expect(result.sources).toEqual(["began in 1789   with the storming"]);
  });
});
