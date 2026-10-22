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

export type RememberedProvider = {
  id: string;
  providerId: string;
  apiKey: string;
  model: string;
  updatedAt: number;
};
