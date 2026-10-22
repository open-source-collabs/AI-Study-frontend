import { describe, expect, it } from "vitest";
import { quizSchema } from "./index";

const question = { question: "Q?", options: ["a", "b", "c", "d"], answerIndex: 2, explanation: "because" };

describe("quizSchema", () => {
  it("accepts a well-formed quiz", () => {
    expect(quizSchema.safeParse({ questions: [question] }).success).toBe(true);
  });

  it("rejects a question without exactly 4 options", () => {
    expect(quizSchema.safeParse({ questions: [{ ...question, options: ["a", "b", "c"] }] }).success).toBe(false);
  });

  it("rejects an answer index outside the options", () => {
    expect(quizSchema.safeParse({ questions: [{ ...question, answerIndex: 4 }] }).success).toBe(false);
  });
});
