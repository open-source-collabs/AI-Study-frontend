import { describe, expect, it } from "vitest";
import type { ProgressEvent } from "@/core/storage";
import { summarizeProgress } from "./summarize";

const now = new Date(2026, 9, 22, 12).getTime();
const hoursAgo = (hours: number) => now - hours * 3_600_000;
const card = (setId: string, cardIndex: number, known: boolean, at: number, total = 4): ProgressEvent => ({ type: "card", setId, cardIndex, known, total, at });
const sets = [{ id: "a", title: "Biology" }, { id: "b", title: "History" }];

describe("summarizeProgress", () => {
  it("counts activity per day for the last 7 days, oldest first", () => {
    const { days } = summarizeProgress([card("a", 0, true, hoursAgo(1)), card("a", 1, true, hoursAgo(2)), card("a", 2, true, hoursAgo(30)), card("a", 3, true, hoursAgo(24 * 20))], sets, now);
    expect(days).toHaveLength(7);
    expect(days[6].count).toBe(2);
    expect(days[5].count).toBe(1);
    expect(days.reduce((sum, day) => sum + day.count, 0)).toBe(3);
  });

  it("lists the newest quiz scores first, capped at 5", () => {
    const quizzes: ProgressEvent[] = Array.from({ length: 6 }, (_, i) => ({ type: "quiz", setId: "b", score: i, total: 8, at: hoursAgo(10 - i) }));
    const result = summarizeProgress(quizzes, sets, now).quizzes;
    expect(result).toHaveLength(5);
    expect(result[0]).toMatchObject({ score: 5, setTitle: "History", total: 8 });
  });

  it("measures mastery from the latest mark of each card", () => {
    const events = [card("a", 0, true, hoursAgo(5)), card("a", 1, true, hoursAgo(4)), card("a", 1, false, hoursAgo(3)), card("a", 2, true, hoursAgo(2))];
    expect(summarizeProgress(events, sets, now).mastery).toEqual([{ known: 2, setTitle: "Biology", total: 4 }]);
  });
});
