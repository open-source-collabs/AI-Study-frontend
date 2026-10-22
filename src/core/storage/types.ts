export type MaterialSourceType = "text" | "pdf";

export type StudySet = {
  id: string;
  title: string;
  sourceName: string;
  sourceType: MaterialSourceType;
  // Chunks never overlap, so chunks.join("") is the full text. Storing both doubled the size of every set.
  chunks: string[];
  createdAt: number;
  updatedAt: number;
};

export type OutputKind = "summary" | "flashcards" | "quiz";

// `data` is whatever the generating feature produced; readers must validate it with their zod schema.
export type StoredOutput = {
  id: string;
  setId: string;
  kind: OutputKind;
  data: unknown;
  createdAt: number;
};

export type CheckpointMode = "summary" | "flashcards" | "quiz" | "ask";

// One row per study set and mode, so a card position survives a quick look at the summary.
// `position` is the card index or question index; `score` is the quiz score so far.
export type Checkpoint = {
  id: string;
  setId: string;
  mode: CheckpointMode;
  position: number;
  score?: number;
  updatedAt: number;
};

export type ProgressEventData =
  | { type: "card"; cardIndex: number; known: boolean; total: number }
  | { type: "quiz"; score: number; total: number };

export type ProgressEvent = ProgressEventData & { id?: number; setId: string; at: number };

export type RememberedProvider = {
  id: string;
  providerId: string;
  apiKey: string;
  model: string;
  updatedAt: number;
};
