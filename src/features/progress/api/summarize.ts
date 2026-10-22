import { latestCardMarks, type ProgressEvent } from "@/core/storage";

type SetInfo = { id: string; title: string };
type CardEvent = Extract<ProgressEvent, { type: "card" }>;

const dayKey = (time: number) => new Date(time).toDateString();

export function summarizeProgress(events: ProgressEvent[], sets: SetInfo[], now = Date.now()) {
  const titleOf = (setId: string) => sets.find((set) => set.id === setId)?.title ?? "Unknown set";

  // Activity: reviews and quiz answers per day for the last 7 days, oldest first.
  const days = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(now);
    day.setDate(day.getDate() - (6 - offset));
    return { key: day.toDateString(), label: day.toLocaleDateString("en-US", { weekday: "short" }), count: 0 };
  });
  for (const event of events) {
    const day = days.find((candidate) => candidate.key === dayKey(event.at));
    if (day) day.count += 1;
  }

  const quizzes = events
    .filter((event) => event.type === "quiz")
    .slice(-5)
    .reverse()
    .map((event) => ({ at: event.at, score: event.score, setTitle: titleOf(event.setId), total: event.total }));

  // Mastery: for each set with reviewed cards, how many cards are currently marked known.
  const cardEvents = new Map<string, CardEvent[]>();
  for (const event of events) {
    if (event.type === "card") cardEvents.set(event.setId, [...(cardEvents.get(event.setId) ?? []), event]);
  }
  const mastery = [...cardEvents].map(([setId, setEvents]) => {
    const total = setEvents[setEvents.length - 1].total;
    const known = Object.entries(latestCardMarks(setEvents)).filter(([cardIndex, isKnown]) => isKnown && Number(cardIndex) < total).length;
    return { known, setTitle: titleOf(setId), total };
  });

  return { days, mastery, quizzes };
}
