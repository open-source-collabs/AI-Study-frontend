import { describe, expect, it } from "vitest";
import { cn } from "./cn";
import { createId } from "./id";

describe("core utilities", () => {
  it("joins only active class names", () => {
    expect(cn("card", false, undefined, "card-active")).toBe("card card-active");
  });

  it("creates prefixed unique ids", () => {
    const first = createId("study-set");
    const second = createId("study-set");

    expect(first).toMatch(/^study-set-/);
    expect(second).not.toBe(first);
  });
});
