import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { checkpointRepository, outputRepository, progressRepository, studySetRepository } from "./index";

// These run against a real (in-memory) IndexedDB, so they also prove the Dexie schema opens.
describe("storage", () => {
  it("round-trips a study set and a stored output", async () => {
    await studySetRepository.add({ id: "set-1", title: "Biology", sourceName: "notes.md", sourceType: "text", chunks: ["abc"], createdAt: 1, updatedAt: 1 });
    expect((await studySetRepository.list()).map((set) => set.id)).toContain("set-1");

    await outputRepository.put("set-1", "quiz", { questions: [] });
    expect((await outputRepository.get("set-1", "quiz"))?.data).toEqual({ questions: [] });
  });

  it("keeps a separate checkpoint per mode and returns the most recent one", async () => {
    await checkpointRepository.save({ setId: "set-2", mode: "flashcards", position: 4 });
    await new Promise((resolve) => setTimeout(resolve, 5));
    await checkpointRepository.save({ setId: "set-2", mode: "quiz", position: 2, score: 1 });

    expect(await checkpointRepository.get("set-2", "flashcards")).toMatchObject({ position: 4 });
    expect(await checkpointRepository.latest()).toMatchObject({ setId: "set-2", mode: "quiz", position: 2, score: 1 });

    await checkpointRepository.clear("set-2", "quiz");
    expect(await checkpointRepository.get("set-2", "quiz")).toBeUndefined();
    expect(await checkpointRepository.get("set-2", "flashcards")).toBeDefined();
  });

  it("restores the latest mark of each card for one set only", async () => {
    await progressRepository.record("set-3", { type: "card", cardIndex: 0, known: false, total: 3 });
    await progressRepository.record("set-3", { type: "card", cardIndex: 0, known: true, total: 3 });
    await progressRepository.record("set-3", { type: "card", cardIndex: 1, known: false, total: 3 });
    await progressRepository.record("other-set", { type: "card", cardIndex: 2, known: true, total: 3 });

    expect(await progressRepository.cardMarks("set-3")).toEqual({ 0: true, 1: false });
  });
});
