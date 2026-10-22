import { describe, expect, it } from "vitest";
import { extractTextFromFile } from "./extract";

describe("extractTextFromFile", () => {
  it("reads plain text and markdown files", async () => {
    await expect(extractTextFromFile(new File(["hello"], "notes.md"))).resolves.toBe("hello");
  });

  it("rejects unsupported file types", async () => {
    await expect(extractTextFromFile(new File(["x"], "app.exe"))).rejects.toThrow("Only PDF, TXT, and Markdown");
  });

  it("rejects files over 10 MB", async () => {
    const big = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "big.txt");
    await expect(extractTextFromFile(big)).rejects.toThrow("smaller than 10 MB");
  });
});
