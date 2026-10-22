import type { ProgressEvent } from "./types";

// Cards can be re-marked, so the last event for each card wins. Events arrive oldest first.
export function latestCardMarks(events: ProgressEvent[]) {
  const marks: Record<number, boolean> = {};
  for (const event of events) if (event.type === "card") marks[event.cardIndex] = event.known;
  return marks;
}
