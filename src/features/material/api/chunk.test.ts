import { describe, expect, it } from "vitest";
import { chunkText } from "./chunk";

describe("chunkText", () => {
  it("trims input and splits it into bounded chunks", () => {
    expect(chunkText("  abcdef  ", 3)).toEqual(["abc", "def"]);
  });

  it("returns no chunks for empty material", () => {
    expect(chunkText("   ")).toEqual([]);
  });
});
